const CTF_challenges = require("../../../../model/CTFchallengeModel");
const Path = require("path");
const fs = require("fs");

exports.deleteChallenge = async (req, res) => {
  try {
    const { ChallengeId } = req.params;
    let relativePath;
    let dirPath;
    const Challenge = await CTF_challenges.findByIdAndDelete(ChallengeId);
    if (!Challenge) {
      return res.status(500).json({ message: "Failed to delete Challenge" });
    }

    if (!Challenge.attachments || Challenge.attachments.length === 0) {
      return res
        .status(200)
        .json({ message: "Challenge deleted successfully"});
    }
    relativePath = Array.isArray(Challenge.attachments)
      ? Challenge.attachments[0]
      : Challenge.attachments;
    dirPath = Path.dirname(relativePath);
    dirPath = Path.join(process.cwd(), "public", dirPath);

    //console.log("Deleting challenge folder:", dirPath);

    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log("Challenge folder deleted");
    } catch (error) {
      console.error("Error deleting challenge folder:", error);
      //return res.status(500).json({ message: "Failed to delete challenge folder", error });
    }

    res
      .status(200)
      .json({ message: "Challenge deleted successfully", Challenge });
  } catch (error) {
    console.error("Challenge deleting error:", error);
    if(process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message:"Internal server error" ,error: error.message ,});
    }
    return res.status(500).json({ message: "Challenge Not found"});
  }
};
