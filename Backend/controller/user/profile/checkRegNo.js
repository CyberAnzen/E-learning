
const {User} = require('../../../model/UserModel'); // Adjust the path as necessary


const checkRegNo = async (req, res) => {
  try {
    const { regNumber } = req.body;

    // 1. Validate the presence of `username`
    if (!regNumber) {
      return res.status(400).json({ 
        Success: false,
        error: "reg No is required" });
    }

    // 2. Perform a case-insensitive exact match against user_details.user_name
    const user = await User.findOne({
      regNumber: {
        $regex: `^${regNumber}$`,
        $options: "i", // case-insensitive
      },
    });

    // 3. If found, the username is NOT available
    if (user) {
      return res.json({ 
        Success: true,
        available: true });
    } else {
      return res.json({ 
        Success: true,
        available: false });
    }
  } catch (error) {
    console.error("Error in checkusername:", error);
    return res.status(500).json({ 
        Success: false,
        error: "Server error" });
  }
};

module.exports = checkRegNo;