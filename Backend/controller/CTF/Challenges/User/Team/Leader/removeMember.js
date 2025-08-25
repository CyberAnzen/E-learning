const TeamModel = require("../../../../../../model/TeamModel");

exports.removeMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.body;
    const leaderId = req.user.id; // Leader is the one making the request

    // Call the static method from your schema
    const result = await TeamModel.removeMember(teamId, leaderId, memberId);

    res.status(200).json({
      message: "Member removed successfully",
      data: result, // Contains memberId and confirmation
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Something went wrong",
    });
  }
};
