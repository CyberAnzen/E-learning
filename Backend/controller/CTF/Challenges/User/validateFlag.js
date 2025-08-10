const CTF_progress = require("../../../../model/CTFprogressModel");

exports.validateFlag = async (req, res) => {
  const userId = req.user.id;
  const { ChallengeId } = req.params;
  const { Flag } = req.body;

  if (!ChallengeId || !Flag) {
    return res
      .status(400)
      .json({ message: "ChallengeId and Flag are required" });
  }

  try {
    const result = await CTF_progress.validateFlag(userId, ChallengeId, Flag);
    if (!result.Challenge) {
      return res.status(404).json({ message: "Progress not found" });
    }

    if (result.correct) {
      return res.status(200).json({
        message: "Flag is correct",
        updated: result.updated,
        created: result.created,
        Challenge: result.Challenge,
        correct: true,
      });
    } else {
      return res.status(200).json({
        message: "Flag is incorrect",
        updated: result.updated,
        created: result.created,
        Challenge: result.Challenge,
        correct: false,
      });
    }
  } catch (error) {
    console.error("Flag validation error:", error);
    return res.status(500).json({ message: "Error validating flag", error });
  }
};
