const CTF_challenges = require("../../../model/CTFchallengeModel");

exports.getChallengeAdmin = async (req, res) => {
  const { ChallengeId } = req.params;
  try {
    const Challenge = await CTF_challenges.findById(ChallengeId);
    if (!Challenge) {
      return res.status(500).json({ message: "Failed to fetch Challenge" });
    }

    // 7) respond
    res
      .status(200)
      .json({ message: "Challenge fetched successfully", Challenge });
  } catch (error) {
    console.error("Challenge fetching error:", error);
    return res.status(400).json({ message: "Challenge Not found", error });
  }
};
