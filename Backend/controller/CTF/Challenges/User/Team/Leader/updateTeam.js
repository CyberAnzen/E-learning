const TeamModal = require("../../../../../../model/TeamModel");

exports.updateTeam = async (req, res) => {
  const { teamId, teamName, description } = req.body;
  const userId = req.user.id;
  const updates = { teamName, description };
  if (!teamId || !updates) {
    return res
      .status(400)
      .json({ message: "Team ID and upda*tes are required" });
  }

  try {
    const updatedTeam = await TeamModal.updateTeamDetails(
      teamId,
      userId,
      updates
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
