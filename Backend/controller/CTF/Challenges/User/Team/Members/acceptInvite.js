const TeamModal = require("../../../../../../model/TeamModel");
exports.acceptInvite = async (req, res) => {
  const { teamId, inviteCode } = req.body;
  const userId = req.user.id;

  if (!teamId || !inviteCode) {
    return res
      .status(400)
      .json({ message: "Team ID and invite code are required" });
  }

  try {
    const result = await TeamModal.acceptInvite(userId, teamId, inviteCode);
    if (result) {
      res.status(200).json({
        message: "Invite accepted successfully",
        data: result, // Contains team details or confirmation
      });
    } else {
      res.status(404).json({ message: "Invite not found or already accepted" });
    }
  } catch (error) {
    console.error("Error accepting invite:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
