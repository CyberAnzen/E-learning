const TeamModel = require("../../../../../../model/TeamModel");

exports.generateInvite = async (req, res) => {
  try {
    const { teamId, memberId } = req.body;
    const leaderId = req.user.id; // Leader is the one making the request

    // Call the static method from your schema
    const result = await TeamModel.inviteMember(teamId, leaderId, memberId);

    res.status(200).json({
      message: "Invite generated successfully",
      data: result, // Contains memberId and inviteCode
    });
  } catch (error) {
    if(process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message:"Internal server error" ,error: error.message ,});
    }
    return res.status(400).json({
      message:  "Something went wrong",
    });
  }
};
