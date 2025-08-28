const CTF_challenges = require("../../../../model/CTFchallengeModel");

exports.getChallengeAdmin = async (req, res) => {
  try {
      const { ChallengeId } = req.params;

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
    if(process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message:"Internal server error" ,error: error.message ,});
    }
    return res.status(400).json({ message: "Challenge Not found"});
  }
};
