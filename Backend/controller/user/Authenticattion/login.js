const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const { User } = require("../../../model/UserModel");

exports.login = async (req, res, next) => {
  const { identifier, password, rememberMe } = req.body;
  try {
    // Input validation
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password are required" });
    }

    const user = await User.findOne({
      $or: [
        { username: identifier },
        { "userDetails.regNumber": identifier },
        { "userDetails.email": identifier },
        { "userDetails.officialEmail": identifier },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const payload = {
      id: user._id,
      username: user.username,
      role: user.userRole,
    };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: rememberMe ? "20d" : "1h", // Matches the cookie's maxAge
    });

    // Set the token cookie
    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
      maxAge: rememberMe ? 20 * 24 * 60 * 60 * 1000 : 3600000, // 20 days or 1 hour
    });

    // Set a separate cookie to store rememberMe flag (optional, for middleware to access)
    res.cookie("user_token", rememberMe.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
      maxAge: rememberMe ? 20 * 24 * 60 * 60 * 1000 : 3600000,
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
