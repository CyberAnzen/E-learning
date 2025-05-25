//const UserModel = require("../model/UserModel")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
// Ensure your JWT_SECRET is stored securely (e.g., in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const { DetailedUser } = require("../model/UserModel"); // Use DetailedUser for detailed registration
const OTP = require("../model/OTPModel")
exports.signup = async (req, res) => {
  const formattedDateTime = new Date().toLocaleString();

  // Helper function to recursively find missing fields
  function findMissingFields(obj) {
    const missingFields = [];
    function checkFields(obj, parentKey = "") {
      for (const key in obj) {
        const value = obj[key];
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        if (value === null || value === undefined || value === "") {
          missingFields.push(fullKey);
        } else if (typeof value === "object" && !Array.isArray(value)) {
          checkFields(value, fullKey);
        }
      }
    }
    checkFields(obj);
    return missingFields;
  }

  // Hash password using bcrypt
  const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  try {
    // Hash the incoming password
    const hashed = await hashPassword(req.body.password);

    // Destructure fields from request body
    const { username, fullName, dept, email, officialEmail, mobile, regNumber, section, year, gender } = req.body;

    // Build the user information object
    const info = {
      user_name: username,
      password: hashed,
      user_details: {
        name: fullName,
        dept: dept,
        section: section,
        phone_no: mobile,
        email: email,
        reg_no: regNumber,
        gender: gender,
        official_email: officialEmail,
        year: year,
        reg_date: formattedDateTime,
      },
    };

    // Check for any missing fields
    const missingFields = findMissingFields(info);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: "Missing fields", missingFields });
    }

    // Create the new user document using the detailed user model
    const user = await DetailedUser.create(info);
    if (!user) {
      return res.status(404).send("User not created");
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in signup", error);
    res.status(500).send("Error in signup");
  }
};




exports.login = async (req, res, next) => {
  const { identifier, password, rememberMe } = req.body;
  try {
    const user = await DetailedUser.findOne({
      $or: [
        { user_name: identifier },
        { 'user_details.reg_no': identifier },
        { 'user_details.email': identifier },
        { 'user_details.official_email': identifier }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const payload = { id: user._id, username: user.user_name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'strict',
      maxAge: rememberMe ? 20 * 24 * 60 * 60 * 1000 : 3600000, // 20 days or 1 hour
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



exports.checkusername = async (req, res) => {
    try {
      const { username } = req.query;
  
      // 1. Validate the presence of `username`
      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }
  
      // 2. Perform a case-insensitive exact match against user_details.user_name
      const user = await DetailedUser.findOne({
        user_name: {
          $regex: `^${username}$`,
          $options: "i", // case-insensitive
        },
      });
  
      // 3. If found, the username is NOT available
      if (user) {
        return res.json({ available: false });
      } else {
        return res.json({ available: true });
      }
    } catch (error) {
      console.error("Error in checkusername:", error);
      return res.status(500).json({ error: "Server error" });
    }
  };



  exports.otp_generator = async (req, res) => {
    try {
        const { reg_number, email } = req.body;
        let request;

        if (reg_number) {
            // When reg_number is provided, query by user_details.reg_no
            request = { "user_details.reg_no": reg_number };
        } else if (email) {
            // When email is provided, query against both email and official_email fields
            request = { 
                $or: [
                    { "user_details.email": email },
                    { "user_details.official_email": email }
                ]
            };
        } else {
            return res.status(400).send("No registration number or email provided");
        }

        // Select the necessary fields, including official_email for cases where email might match that field.
        const user = await DetailedUser.findOne(request)
            .select("user_details.email user_details.official_email user_details.reg_no _id user_name");
        
        if (!user) {
            return res.status(400).send("User not found");
        }

        // Check if an OTP document already exists for this user (by email or reg_no)
        const existingOTP = await OTP.findOne({
            $or: [
                { email: user.user_details.email },
                { reg_no: user.user_details.reg_no }
            ]
        });
        if (existingOTP) {
            await OTP.deleteOne({ _id: existingOTP._id });
            console.log("Existing OTP document deleted.");
        }

        // Generate a 6-digit OTP between 100000 and 999999
        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        console.log(`Generated OTP: ${otp}`);

        // Use the email provided in the request if available; otherwise, fall back to user_details.email.
        const finalEmail = email ? email : user.user_details.email;

        const info = {
            otp: otp,
            email: finalEmail,
            user_id: user._id,
            user_name: user.user_name,
            reg_no: user.user_details.reg_no,
            official_email: user.user_details.official_email
        };

        // Create new OTP document
        const otpEntry = await OTP.create(info);
        if (!otpEntry) {
            return res.status(500).send("OTP not created");
        }

        res.status(200).json({ message: "OTP generated successfully", userId: user._id });
    } catch (error) {
        console.error("Error in otp_generator:", error);
        res.status(500).send("Error in OTP generation");
    }
};

exports.otp_verify = async (req, res) => {
  try {
    const { otp, email, reg_number } = req.body;
    let request;

    if (reg_number) {
      // When reg_number is provided, query by reg_no
      request = { reg_no: reg_number };
    } else if (email) {
      // When email is provided, query against both email and official_email fields in the OTP collection
      request = { $or: [{ email: email }, { official_email: email }] };
    } else {
      return res.status(400).send("No registration number or email provided");
    }

    // Find OTP document from OTP collection
    const otps = await OTP.findOne(request);
    if (!otps) {
      return res.status(400).send("OTP not found");
    } else {
      if (otp == otps.otp) {
        // Find the user from DetailedUser using the reg_no and matching either email or official_email from user_details
        const user = await DetailedUser.findOne({
          "user_details.reg_no": otps.reg_no,
          $or: [
            { "user_details.email": otps.email },
            { "user_details.official_email": otps.email }
          ]
        }).select("user_details.email user_details.official_email _id user_name password");
        
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.status(200).json({ message: "OTP verified" });
      } else {
        return res.status(400).json({ message: "OTP is not verified" });
      }
    }
  } catch (error) {
    console.error("Error in verifying OTP", error);
    res.status(500).json({ message: "Error in verifying OTP" });
  }
};


exports.password_reset = async (req, res) => {
  try {
    const hashPassword = async (password) => {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    };
    const { otp, email, reg_number, newPassword } = req.body;
    let request;

    if (reg_number) {
      // When reg_number is provided, query by reg_no
      request = { reg_no: reg_number };
    } else if (email) {
      // When email is provided, query against both email and official_email fields in the OTP collection
      request = { $or: [{ email: email }, { official_email: email }] };
    } else {
      return res.status(400).send("No registration number or email provided");
    }

    // Find OTP document from OTP collection
    const otps = await OTP.findOne(request);
    if (!otps) {
      return res.status(400).send("OTP not found");
    } else {
      if (otp == otps.otp) {
        // Hash the new password
        const hashed = await hashPassword(newPassword);
        // Update the user in DetailedUser by matching the reg_no and checking for a matching email or official_email in user_details
        const user = await DetailedUser.findOneAndUpdate(
          {
            "user_details.reg_no": otps.reg_no,
            $or: [
              { "user_details.email": otps.email },
              { "user_details.official_email": otps.email }
            ]
          },
          { $set: { password: hashed } }
        );
        if (!user) {
          return res.status(400).send("User not found");
        } else {
          // Delete the OTP document after successful password reset
          await OTP.deleteOne({ _id: otps._id });
          console.log("OTP document deleted after password reset.");
          res.status(200).json({ message: "Password reset" });
        }
      } else {
        return res.status(400).json({ message: "OTP is not verified" });
      }
    }
  } catch (error) {
    console.error("Error in resetting the password", error);
    res.status(500).json({ message: "Error in resetting the password" });
  }
};




