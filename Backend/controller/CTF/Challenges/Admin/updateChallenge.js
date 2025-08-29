const CTF_challenges = require("../../../../model/CTFchallengeModel");
const customError = require("../../../../utilies/customError");
const Path = require("path");
const fs = require("fs");

exports.updateChallenge = async (req, res) => {

  try {
    const { ChallengeId } = req.params;
      let deleteDir = false;
  
    let relativePath;
    let dirPath;
    const {
      title,
      description,
      score,
      category,
      //attachments,
      existingAttachments,
      flag,
      difficulty,
    } = req.body;
    // console.log(req.body);
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
          return res
            .status(400)
            .json({ message: "hints must be a JSON array" });
        }
      } catch (err) {
        return res.status(400).json({ message: "Invalid hints JSON" });
      }
    }

    uploadedFiles = (req.files || []).map((f) =>
      Path.join(process.cwd(), req.customFileUpload.randomPathName, f.filename)
    );
    const challenge = await CTF_challenges.findById(ChallengeId);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    
    let existingAttachmentsArray = [];
    let deletedAttachments = [];
    if (existingAttachments) {
      try {
        existingAttachmentsArray = JSON.parse(existingAttachments);
      } catch (error) {
        throw new customError("Invalid existingAttachments JSON", 400);
      }
      // Check for attachments to delete
      deletedAttachments = challenge.attachments.filter(
        (filePath) => !existingAttachmentsArray.includes(filePath)
      );
    } else {
      deletedAttachments = challenge.attachments;
      console.log("Deleted Attachments:", deletedAttachments);

      if (deletedAttachments.length > 0) {
        deleteDir = true;
        relativePath = Array.isArray(deletedAttachments)
          ? deletedAttachments[0]
          : deletedAttachments;
        dirPath = Path.dirname(relativePath);
      } else {
        deleteDir = false;
      }
    }

    try {
      deletedAttachments.forEach((filePath) => {
        const fullPath = Path.join(process.cwd(), filePath);
        console.log(`Attempting to delete file: ${fullPath}`);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`Deleted file: ${fullPath}`);
        } else {
          console.warn(`File not found for deletion: ${fullPath}`);
        }
      });
    } catch (error) {
      throw new customError(
        "Error deleting ctf challemges: ",
        500,
        {},
        error.message
      );
    }

    let newAttachments = (req.files || []).map((f) => {
      const filePath = Path.join(
        req.customFileUpload.randomPathName,
        f.filename
      );
      return filePath.replace(/\\/g, "/").replace(/^public\//, "");
    });

    // Combine existing attachments with new ones
    if (existingAttachmentsArray && existingAttachmentsArray.length > 0) {
      newAttachments = [...existingAttachmentsArray, ...newAttachments];
    }
    const payload = {
      title,
      description,
      score,
      category,
      tags,
      hints,
      attachments: newAttachments,
      flag,
      difficulty,
    };

    console.log("Payload for update:", payload);

    const Challenge = await CTF_challenges.findByIdAndUpdate(
      ChallengeId,
      payload,
      { new: true, runValidators: true }
    );

    if (!Challenge) {
      console.error("Challenge not found for update:", ChallengeId);
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.status(200).json({
      message: "Challenge updated successfully",
      Challenge,
    });
     if (deleteDir) {
    dirPath = Path.join(process.cwd(), "public", dirPath);
    console.log("Deleting challenge folder:", dirPath);

    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log("Challenge folder deleted");
    } catch (error) {
      
      console.error("Error deleting challenge folder:");
    }
  }
  } catch (error) {
    console.error("Challenge update error:", error);

    // 🔥 Rollback: remove any uploaded files since the update failed
      uploadedFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`Rolled back uploaded file: ${file}`);
      }
    });
    if(process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message:"Internal server error" ,error: error.message ,});
    }
    return res.status(400).json({ message: "Error updating challenge"});
  }

};
