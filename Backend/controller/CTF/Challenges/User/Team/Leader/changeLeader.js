const TeamModal = require("../../../../../../model/TeamModel");

exports.changeLeader = async (req, res) => {
  const { teamId, newLeaderId } = req.body;
  const userId = req.user.id;
  if (!teamId || !newLeaderId) {
    return res
      .status(400)
      .json({ message: "Team ID and New Leader ID are required" });
  }
  try {
    const updatedTeam = await TeamModal.changeLeader(
      teamId,
      userId,
      newLeaderId
    );
    res.status(200).json({
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
