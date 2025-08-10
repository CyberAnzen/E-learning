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

// Static methods for CTFprogress model
CTFprogress.statics.getHint = async (userId, challengeId, hintId) => {
  // Try to find existing progress
  const exist = await this.findOne({ userId, challengeId }).lean();
  if (!exist) throw new Error("Progress not found");
  if (exist.Flag_Submitted) {
  }
};
CTFprogress.statics.getHint = async function (userId, challengeId, hintId) {
  const progress = await this.findOne({ userId, challengeId });
  if (!progress) throw new Error("Progress not found");

  const Challenge = await CTF_challenges.findById(challengeId).lean();
  if (!Challenge) throw new Error("Challenge not found");

  // ensure progress.hints initialized from Challenge if missing/empty
  if (!Array.isArray(progress.hints) || progress.hints.length === 0) {
    const initialHints = Array.isArray(Challenge.hints)
      ? Challenge.hints.map((h) => ({ hintId: h._id, used: false }))
      : [];
    await this.updateOne(
      { userId, challengeId },
      { $set: { hints: initialHints } },
      { upsert: true }
    );
    progress.hints = initialHints;
  }

  // Case 1: Flag already submitted -> always unlock, do NOT reduce score
  if (progress.Flag_Submitted) {
    const hintExists = progress.hints.some(
      (h) => String(h.hintId) === String(hintId)
    );

    if (hintExists) {
      await this.updateOne(
        { userId, challengeId, "hints.hintId": hintId },
        { $set: { "hints.$.used": true } }
      );
    } else {
      await this.updateOne(
        { userId, challengeId },
        { $push: { hints: { hintId, used: true } } }
      );
    }

    return this.fetchProgress(userId, challengeId);
  }

  // Case 2: Flag not submitted -> can only unlock first locked hint and reduce score by hint.cost
  const firstLockedHint = progress.hints.find((h) => !h.used);
  if (!firstLockedHint) return this.fetchProgress(userId, challengeId); // all used already

  if (String(firstLockedHint.hintId) !== String(hintId)) {
    return this.fetchProgress(userId, challengeId); // only first locked hint may be unlocked
  }

  // find cost from Challenge.hints
  let cost = 0;
  if (Array.isArray(Challenge.hints)) {
    const hd = Challenge.hints.find((h) => String(h._id) === String(hintId));
    if (hd && typeof hd.cost === "number") cost = hd.cost;
  }

  const update = { $set: { "hints.$.used": true } };
  if (cost && typeof cost === "number")
    update.$inc = { score: -Math.abs(cost) };

  await this.updateOne({ userId, challengeId, "hints.hintId": hintId }, update);

  return this.fetchProgress(userId, challengeId);
};

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

CTFprogress.statics.validateFlag = async function (userId, challengeId, Flag) {
  const challenge = await CTF_challenges.findById(challengeId).lean();
  if (!challenge)
    return { updated: false, created: false, correct: false, Challenge: false };

  // Normalize both values if case-insensitive match is desired
  const submittedFlag = String(Flag).trim();
  const correctFlag = String(challenge.flag).trim();

  // Attempt to update atomically
  const progress = await this.findOne({ userId, challengeId });
  if (!progress)
    return { updated: false, created: false, correct: false, Challenge: false };

  if (progress.attempt >= Flag_attempt) {
    return { updated: false, created: false, correct: false, Challenge: progress };
  }

  if (submittedFlag === correctFlag) {
    const updatedDoc = await this.findOneAndUpdate(
      { _id: progress._id },
      { $set: { Flag_Submitted: true }, $inc: { attempt: 1 } }, // remove $inc if you don't want to count correct attempts
      { new: true }
    );
    return { updated: true, created: false, correct: true, Challenge: updatedDoc };
  } else {
    const updatedDoc = await this.findOneAndUpdate(
      { _id: progress._id },
      { $inc: { attempt: 1 } },
      { new: true }
    );
    return { updated: true, created: false, correct: false, Challenge: updatedDoc };
  }
};

module.exports = mongoose.model("CTF_progress", CTFprogress);
