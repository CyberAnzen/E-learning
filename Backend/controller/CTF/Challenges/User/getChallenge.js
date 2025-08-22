const CTF_progress = require("../../../../model/CTFprogressModel");
const CTF_Teamprogress = require("../../../../model/CTF_TeamModel");
const { User } = require("../../../../model/UserModel");

exports.getChallenge = async (req, res) => {
  const userId = req.user.id;
  const { ChallengeId } = req.params;

  if (!ChallengeId) {
    return res.status(400).json({ message: "ChallengeId is required" });
  }

  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const teamId = user.teamId || null;

    // Fetch user progress
    const userProgress = await CTF_progress.fetchProgress(userId, ChallengeId);
    if (!userProgress) {
      return res.status(404).json({ message: "User progress not found" });
    }

    let finalChallenge = userProgress;

    // If user is part of a team, fetch team progress
    if (teamId) {
      try {
        const teamProgress = await CTF_Teamprogress.fetchProgress(
          teamId,
          ChallengeId
        );

        if (teamProgress) {
          console.log("team Fetch called ");

          finalChallenge = teamProgress;
        }
        console.log(teamProgress);
      } catch (err) {
        console.error("Team progress fetch error:", err.message || err);
      }
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
