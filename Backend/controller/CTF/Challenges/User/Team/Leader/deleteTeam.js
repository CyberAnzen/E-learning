const TeamModal = require("../../../../../../model/TeamModel");

exports.deleteTeam = async (req, res) => {
  const { teamId } = req.body;
  const userId = req.user.id;

  if (!teamId) {
    return res.status(400).json({ message: "Team ID is required" });
  }

  try {
    const result = await TeamModal.deleteTeam(teamId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
