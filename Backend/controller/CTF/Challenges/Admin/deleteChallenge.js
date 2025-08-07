const CTF_challenges = require("../../../../model/CTFchallengeModel");

exports.deleteChallenge = async (req, res) => {
  const { ChallengeId } = req.params;
  try {
    const Challenge = await CTF_challenges.findByIdAndDelete(ChallengeId);
    if (!Challenge) {
      return res.status(500).json({ message: "Failed to delete Challenge" });
    }

    res
      .status(200)
      .json({ message: "Challenge deleted successfully", Challenge });
  } catch (error) {
    console.error("Challenge deleting error:", error);
    return res.status(400).json({ message: "Challenge Not found", error });
  }
};
