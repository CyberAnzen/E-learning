const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Ensure your JWT_SECRET is stored securely (e.g., in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const { User } = require("../../../model/UserModel"); // Use User for detailed registration

exports.login = async (req, res, next) => {
  const { identifier, password, rememberMe } = req.body;
  try {
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

    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
      maxAge: rememberMe ? 20 * 24 * 60 * 60 * 1000 : 3600000, // 20 days or 1 hour
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
