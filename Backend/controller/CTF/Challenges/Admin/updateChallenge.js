const CTF_challenges = require("../../../../model/CTFchallengeModel");

exports.updateChallenge = async (req, res) => {
  const { ChallengeId } = req.params;
  const {
    title,
    description,
    score,
    category,

    attachments,
    flag,
    difficulty,
  } = req.body;
  // 2) Tags come in as either a string or an array of strings
  //    Because you did `formData.append("tags", tag)` for each tag,
  //    multer will expose req.body.tags as an array if >1, or a string if just 1.
  let tags = req.body.tags || [];
  if (typeof tags === "string") {
    tags = [tags];
  }

  // 3) Hints arrives as a JSON string: '[{"text":"foo","cost":123}, …]'
  let hints = [];
  if (req.body.hints) {
    try {
      hints = JSON.parse(req.body.hints);
      if (!Array.isArray(hints)) {
        return res.status(400).json({ message: "hints must be a JSON array" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid hints JSON" });
    }
  }
  try {
    const payload = {
      title,
      description,
      score,
      category,
      tags,
      hints,
      attachments,
      flag,
      difficulty,
    };

    const Challenge = await CTF_challenges.findByIdAndUpdate(
      ChallengeId,
      payload,
      { new: true, runValidators: true }
    );

    if (!Challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.status(200).json({
      message: "Challenge updated successfully",
      Challenge,
    });
  } catch (error) {
    console.error("Challenge update error:", error);
    return res.status(400).json({ message: "Error updating challenge", error });
  }
};
