const bcrypt = require("bcryptjs");
const { User } = require("../../../model/UserModel"); // Use User for detailed registration

exports.signup = async (req, res) => {
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
    const {
      username,
      fullName,
      dept,
      email,
      officialEmail,
      mobile,
      regNumber,
      section,
      year,
      gender,
    } = req.body;
   console.log("mobile", mobile);
    // Build the user information object
    const info = {
      username: username,
      password: hashed,
      phoneNo: mobile,
      email: email,
      regNumber: regNumber,
      officialEmail: officialEmail,
      userDetails: {
        name: fullName,
        dept: dept,
        section: section,
        gender: gender,
        year: year,
      },
    };
   console.log("info", info);
    // Check for any missing fields
    const missingFields = findMissingFields(info);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: "Missing fields", missingFields });
    }

    // Create the new user document using the detailed user model
    const user = await User.create(info);
    if (!user) {
      return res.status(404).send("User not created");
    }
    res
      .status(200)
      .json({ message: "User created successfully", user: user.username });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ errors: "error in signup" });
  }
};
