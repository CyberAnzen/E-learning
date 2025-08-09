const mongoose = require("mongoose");
const { Schema } = mongoose;
const Flag_attempt = Number(process.env.Flag_Attemtps) || 5;
const CTF_challenges = require("./CTFchallengeModel");

const CTFprogress = new Schema(
  {
    challengeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "CTF_challenges",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "userId is required"],
      validate: {
        validator: (v) => v != null,
        message: "userId cannot be null",
      },
      index: true,
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
      default: 0,
    },
    Flag_Submitted: {
      type: Boolean,
      default: false,
    },
    hints: [
      {
        hintId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        used: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

CTFprogress.index({ userId: 1, challengeId: 1 }, { unique: true });

CTFprogress.statics.fetchProgress = async function (userId, challengeId) {
  const populateHints = async (doc, challenge) => {
    if (!doc) return doc;
    const hintsArr = Array.isArray(doc.hints) ? doc.hints : [];

    // If progress has no hint entries, synthesize them from the challenge.hints
    let effectiveHints = hintsArr;
    if (!effectiveHints.length && challenge && Array.isArray(challenge.hints)) {
      effectiveHints = challenge.hints.map((h) => ({
        hintId: h._id,
        used: false,
      }));
    }

    // Build map of hint subdocs by _id from the challenge (fast lookup)
    const hintMap = {};
    if (challenge && Array.isArray(challenge.hints)) {
      challenge.hints.forEach((h) => {
        if (h && h._id) hintMap[String(h._id)] = h;
      });
    }

    const hints = effectiveHints.map((h) => {
      const id = String(h.hintId);
      const hd = hintMap[id] || null;
      const cost = hd ? hd.cost : null;

      return h.used
        ? { used: true, id, hint: hd ? hd.text ?? null : null, cost }
        : { used: false, id, cost }; // No hint text if not used
    });

    return { ...doc, hints };
  };

  // Try to find existing progress
  const exist = await this.findOne({ userId, challengeId }).lean();

  // Load challenge once (used in both branches)
  const Challenge = await CTF_challenges.findById(challengeId).lean();
  if (!Challenge) throw new Error("Challenge not found");

  if (exist) {
    const doc = await populateHints(exist, Challenge);
    const data = {
      ...doc,
      title: Challenge.title,
      description: Challenge.description,
      category: Challenge.category,
      difficulty: Challenge.difficulty,
      tags: Challenge.tags || [],
      attachments: Challenge.attachments || [],
      challengeNumber: Challenge.challengeNumber,
    };
    return { Flag_Submitted: !!exist.Flag_Submitted, Visited: true, ...data };
  }

  // Create new progress and initialize hints from Challenge.hints
  const initialHints = Array.isArray(Challenge.hints)
    ? Challenge.hints.map((h) => ({ hintId: h._id, used: false }))
    : [];

  const newProgress = await this.findOneAndUpdate(
    { userId, challengeId },
    {
      $setOnInsert: {
        attempt: 0,
        score: Challenge.score || 0,
        Flag_Submitted: false,
        hints: initialHints,
      },
    },
    { new: true, upsert: true }
  ).lean();

  const doc = await populateHints(newProgress, Challenge);
  const data = {
    ...doc,
    title: Challenge.title,
    description: Challenge.description,
    category: Challenge.category,
    difficulty: Challenge.difficulty,
    tags: Challenge.tags || [],
    attachments: Challenge.attachments || [],
    challengeNumber: Challenge.challengeNumber,
  };

  return { Flag_Submitted: false, Visited: false, ...data };
};

CTFprogress.statics.updateAttempts = async function (userId, challengeId) {
  const exist = await this.findOne({ userId, challengeId });
  if (!exist) return { updated: false, created: false, doc: false };
  if (exist.attempt < Flag_attempt) {
    exist.attempt += 1;
    await exist.save();
    return { updated: true, created: false, doc: exist };
  }
  return { updated: false, created: false, doc: false };
};

module.exports = mongoose.model("CTF_progress", CTFprogress);
