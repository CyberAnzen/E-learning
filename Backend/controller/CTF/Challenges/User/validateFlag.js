const CTF_progress = require("../../../../model/CTFprogressModel");
const CTF_Teamprogress = require("../../../../model/CTF_TeamModel");
const { User } = require("../../../../model/UserModel");
exports.validateFlag = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ChallengeId } = req.params;
    const { Flag } = req.body;

    if (!ChallengeId || !Flag) {
      return res
        .status(400)
        .json({ message: "ChallengeId and Flag are required" });
    }
    const user = await User.findById(userId).lean();
    if (!user)
      return res.status(400).json({ message: "Error fetching User Data" });

    const teamId = user.teamId || null;

    let result;

    if (teamId) {
      // User is in a team, validate using team progress
      result = await CTF_Teamprogress.validateFlag(
        teamId,
        ChallengeId,
        Flag,
        userId
      );
    } else {
      // User is not in a team, validate using individual progress
      result = await CTF_progress.validateFlag(
        userId,
        ChallengeId,
        Flag,
        userId
      );
    }

    if (!result.Challenge)
      return res.status(404).json({ message: "Progress not found" });

    return res.status(200).json({
      message: result.correct ? "Flag is correct" : "Flag is incorrect",
      updated: result.updated,
      created: result.created,
      Challenge: result.Challenge,
      correct: result.correct,
    });
  } catch (error) {
    console.error("Flag validation error:", error);
    if(process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
    return res.status(500).json({
      message: "Error validating flag",
      //error: error.message || error,
    });
  }
};
