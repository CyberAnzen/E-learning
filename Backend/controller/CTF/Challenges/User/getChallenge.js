const CTF_progress = require("../../../../model/CTFprogressModel");
const CTF_Teamprogress = require("../../../../model/CTF_TeamModel");
const { User } = require("../../../../model/UserModel");

exports.getChallenge = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ChallengeId } = req.params;

    if (!ChallengeId) {
      return res.status(400).json({ message: "ChallengeId is required" });
    }
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const teamId = user.teamId || null;

    let finalChallenge;

    if (teamId) {
      // User is in a team, use team progress
      finalChallenge = await CTF_Teamprogress.fetchProgress(
        teamId,
        ChallengeId
      );
    } else {
      // User is not in a team, use individual progress
      finalChallenge = await CTF_progress.fetchProgress(userId, ChallengeId);
    }

    if (!finalChallenge) {
      return res.status(404).json({ message: "Progress not found" });
    }

    return res.status(200).json({
      message: "Challenge fetched successfully",
      Challenge: finalChallenge,
    });
  } catch (error) {
    console.error("Challenge fetching error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error while fetching challenge",
      error: error.message || "Unknown error",
    });
  }
};
