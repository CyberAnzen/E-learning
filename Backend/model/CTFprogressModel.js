const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const Flag_attempt = process.env.Flag_Attemtps;
const CTFprogress = new Schema(
  {
    challengeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "CTF_challenges",
      required: true,
      index: true, // fast queries by user
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Users",
      required: true,
      index: true, // fast queries by user
    },
    attempt: {
      type: Number,
      required: true,
      min: 0,
      max: Flag_attempt,
      default: 0,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: Flag_attempt,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
); // Composite unique index: prevent duplicate progress entries for same challenge/user
CTFprogress.index({ userId: 1, challengeId: 1 }, { unique: true });

// STATIC: update attempts
CTFprogress.statics.updateAttempts = async function (userId, challengeId) {
  const exist = await this.findOne({
    userId,
    challengeId,
  });
  if (exist) {
    const attempt = exist.attempt;
    if (exist.attempt <= Flag_attempt) {
      exist.attempt = attempt++;
      await exist.save();
      return { updated: true, created: false, doc: exist };
    }
    return { updated: false, created: false, doc: false };
  }
};
module.exports = mongoose.model("CTF_progress", CTFprogress);
