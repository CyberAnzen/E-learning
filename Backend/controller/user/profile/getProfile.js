const { User } = require("../../../model/UserModel"); // Adjust the path as necessary

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in req.user
    if (!userId) {
      console.error("[getProfile] [error] User ID is required");
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const userProfile = await User.findById(userId).select(
      "-password -__v -createdAt -updatedAt "
    ); // Exclude sensitive fields
    if (!userProfile) {
      console.error(`[getProfile] [error] User with ID ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }
    const existingLinksMap = {};
    (userProfile.profile.socialLinks || []).forEach((link) => {
      existingLinksMap[link.name] = link.link;
    });

    delete userProfile._doc.profile.socialLinks; // Remove the socialLinks field from the userProfile object
    userProfile._doc.profile.socialLinks = existingLinksMap;

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: userProfile,
    });
  } catch (error) {
    console.error("[getProfile] [error] Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = getProfile;
