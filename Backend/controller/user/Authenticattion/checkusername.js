const { User } = require("../../../model/UserModel"); // Use User for detailed registration

exports.checkusername = async (req, res) => {
    try {
      const { username } = req.query;
  
      // 1. Validate the presence of `username`
      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }
  
      // 2. Perform a case-insensitive exact match against user_details.user_name
      const user = await User.findOne({
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