const CTF_challenges = require("../../../../model/CTFchallengeModel");

exports.getallChallenge = async (req, res) => {
  try {
    const Challenges = await CTF_challenges.find(
      {},
      "title description score category challengeNumber difficulty"
    ).lean();

    if (!Challenges || Challenges.length === 0) {
      return res.status(404).json({ message: "No Challenges found" });
    }

    const formattedChallenges = Challenges.map((challenge, index) => ({
      ...challenge,
      challengeNumber: index + 1,
    }));

    res.status(200).json({
      message: "Challenges fetched successfully",
      challenges: formattedChallenges,
    });
  } catch (error) {
    console.error("Challenges fetching error:", error);
    return res.status(400).json({ message: "Challenges Not found", error });
  }
};
