const TeamModal = require("../../../../../../model/TeamModel");

exports.updateMembers = async (req, res) => {
  try {
    const updatedTeam = await TeamModal.updateMembers(
      req.body.teamId,
      req.user.id,
      req.body.members
    );
    res.status(200).json({
      message: "Team members updated successfully",
      team: updatedTeam,
    });
  } catch (error) {

    if(process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message:"Internal server error" ,error: error.message ,});
    }
    return res.status(400).json({ message: "Internal server error" });
  }
};
