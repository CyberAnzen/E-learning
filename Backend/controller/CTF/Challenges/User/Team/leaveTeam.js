const TeamModal = require("../../../../../model/TeamModel");

exports.leaveTeam = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const result = await TeamModal.leaveTeam(userId);

    return res.status(200).json({
      success: true,
      message: "Successfully left the team",
      data: result,
    });
  } catch (error) {
    console.error("Error leaving team:", error);
    return res.status(400).json({ error: error.message });
  }
};
