const CTF_progress = require("../../../../model/CTFprogressModel");
const CTF_Teamprogress = require("../../../../model/CTF_TeamModel");
const { User } = require("../../../../model/UserModel");
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
    const user = await User.findById(userId).lean();
    if (!user)
      return res.status(400).json({ message: "Error fetching User Data" });

    const teamId = user.teamId || null;

    // Always update user progress first
    const userResult = await CTF_progress.validateFlag(
      userId,
      ChallengeId,
      Flag
    );
    if (!userResult.Challenge)
      return res.status(404).json({ message: "User progress not found" });

    let finalChallenge = userResult.Challenge;

    // If correct & user has a team, update team progress
    if (userResult.correct && teamId) {
      try {
        const teamResult = await CTF_Teamprogress.validateFlag(
          teamId,
          ChallengeId,
          Flag,
          userId
        );
        if (teamResult?.Challenge) {
          finalChallenge = teamResult.Challenge; // Prefer team challenge view
        }
      } catch (err) {
        console.error("Team flag sync error:", err.message || err);
      }
    }

    return res.status(200).json({
      message: userResult.correct ? "Flag is correct" : "Flag is incorrect",
      updated: userResult.updated,
      created: userResult.created,
      Challenge: finalChallenge,
      correct: userResult.correct,
    });
  } catch (error) {
    console.error("Flag validation error:", error);
    return res.status(500).json({
      message: "Error validating flag",
      error: error.message || error,
    });
  }
};
