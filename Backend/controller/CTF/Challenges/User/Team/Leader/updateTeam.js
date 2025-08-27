const TeamModal = require("../../../../../../model/TeamModel");

exports.updateTeam = async (req, res) => {
  try {
    const { teamId, teamName, description } = req.body;
    const userId = req.user.id;
    const updates = { teamName, description };
    if (!teamId || !updates) {
      return res
        .status(400)
        .json({ message: "Team ID and upda*tes are required" });
    }

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

    if(process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message:"Internal server error" ,error: error.message ,});
    }
    return res.status(500).json({ message: "Internal server error"});
  }
};
