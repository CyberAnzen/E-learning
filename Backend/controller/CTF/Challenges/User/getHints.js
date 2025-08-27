const CTF_progress = require("../../../../model/CTFprogressModel");
const CTF_Teamprogress = require("../../../../model/CTF_TeamModel");
const { User } = require("../../../../model/UserModel");

exports.getHint = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ChallengeId, hintId } = req.params;

    if (!ChallengeId || !hintId) {
      return res
        .status(400)
        .json({ message: "ChallengeId and hintId are required" });
    }
    const user = await User.findById(userId).lean();
    if (!user)
      return res.status(400).json({ message: "Error fetching User Data" });

    const teamId = user.teamId || null;

    let finalChallenge;

    if (teamId) {
      // User is in a team, use team hint
      finalChallenge = await CTF_Teamprogress.getHint(
        teamId,
        ChallengeId,
        hintId,
        userId
      );
    } else {
      // User is not in a team, use individual hint
      finalChallenge = await CTF_progress.getHint(
        userId,
        ChallengeId,
        hintId,
        userId
      );
    }

    if (!finalChallenge)
      return res.status(404).json({ message: "Hint not found" });

    return res.status(200).json({
      message: "Hint fetched successfully",
      Challenge: finalChallenge,
    });
  } catch (error) {
    console.error("Hint fetching error:", error);
    if(process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
    return res
      .status(400)
      .json({ message: "Error fetching hint", 
      //error: error.message || error 
      });
  }
};
