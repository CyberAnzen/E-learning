const CTF_progress = require("../../../../model/CTFprogressModel");
const CTF_Teamprogress = require("../../../../model/CTF_TeamModel");
const { User } = require("../../../../model/UserModel");

exports.getHint = async (req, res) => {
  const userId = req.user.id;
  const { ChallengeId, hintId } = req.params;

  if (!ChallengeId || !hintId) {
    return res
      .status(400)
      .json({ message: "ChallengeId and hintId are required" });
  }

  try {
    const user = await User.findById(userId).lean();
    if (!user)
      return res.status(400).json({ message: "Error fetching User Data" });

    const teamId = user.teamId || null;
console.log(teamId);

    // Always update user hint first
    const userHint = await CTF_progress.getHint(userId, ChallengeId, hintId);
    if (!userHint) return res.status(404).json({ message: "Hint not found" });

    let finalChallenge = userHint;

    // If user has a team, sync hint for team
    if (teamId) {
      try {
        const teamHint = await CTF_Teamprogress.getHint(
          teamId,
          ChallengeId,
          hintId,
          userId
        );
        if (teamHint) finalChallenge = teamHint;
      } catch (err) {
        console.error("Team hint sync error:", err.message || err);
      }
    }

    return res.status(200).json({
      message: "Hint fetched successfully",
      Challenge: finalChallenge,
    });
  } catch (error) {
    console.error("Hint fetching error:", error);
    return res
      .status(400)
      .json({ message: "Error fetching hint", error: error.message || error });
  }
};
