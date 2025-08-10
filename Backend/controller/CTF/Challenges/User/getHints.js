const CTF_progress = require("../../../../model/CTFprogressModel");

exports.getHint = async (req, res) => {
  const userId = req.user.id;
  const { ChallengeId, hintId } = req.params;
  if (!ChallengeId || !hintId) {
    return res
      .status(400)
      .json({ message: "ChallengeId and hintId are required" });
  }

  try {
    const hint = await CTF_progress.getHint(req.user.id, ChallengeId, hintId);
    if (!hint) {
      return res.status(404).json({ message: "Hint not found" });
    }

    res
      .status(200)
      .json({ message: "Hint fetched successfully", Challenge: hint });
  } catch (error) {
    console.error("Hint fetching error:", error);
    return res.status(400).json({ message: "Error fetching hint", error });
  }
};
