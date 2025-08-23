const mongoose = require("mongoose");
const { Schema } = mongoose;
const Flag_attempt = Number(process.env.Flag_Attempts) || 5;
const CTF_challenges = require("./CTFchallengeModel");

const CTFTeamSchema = new Schema(
  {
    challengeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "CTF_challenges",
      required: true,
      index: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Teams",
      required: [true, "teamId is required"],
      validate: {
        validator: (v) => v != null,
        message: "teamId cannot be null",
      },
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    attempt: {
      type: Number,
      required: true,
      min: 0,
      max: Flag_attempt,
      default: 0,
    },
    Flag_Submitted: {
      type: Boolean,
      default: false,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      validate: {
        validator: function (v) {
          if (this.Flag_Submitted && !v) return false;
          return true;
        },
        message: "submittedBy must be provided when Flag_Submitted is true",
      },
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
        usedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
          validate: {
            validator: function (v) {
              if (this.used && !v) return false;
              return true;
            },
            message: "usedBy must be provided when hint is used",
          },
        },
        usedAt: { type: Date }, // optional timestamp for auditing
      },
    ],
  },
  {
    timestamps: true,
  }
);

// unique compound index
CTFTeamSchema.index({ teamId: 1, challengeId: 1 }, { unique: true });

/**
 * Helper to build the client-friendly hints array
 */
async function _populateHints(doc, challenge) {
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

    if (h.used) {
      return {
        used: true,
        id,
        hint: hd ? hd.text ?? null : null,
        cost,
        usedBy: h.usedBy ? h.usedBy.username : null,
        usedAt: h.usedAt || null,
      };
    } else {
      return { used: false, id, cost };
    }
  });

  // Return a shallow copy with hints replaced by client-friendly form
  const copy = Object.assign({}, doc);
  copy.hints = hints;
  return copy;
}

/**
 * Team: unlock a hint for the team.
 * - teamId, challengeId: identify progress document
 * - hintId: which hint to unlock
 * - usedBy (optional): userId (ObjectId or string) who triggered the hint usage (for audit)
 *
 * Behavior:
 * - If team already submitted flag => mark hint used without reducing score.
 * - If not submitted => only allow unlocking the first locked hint and subtract cost from team score.
 */
CTFTeamSchema.statics.getHint = async function (
  teamId,
  challengeId,
  hintId,
  usedBy = null
) {
  const model = this;
  const progress = await model.findOne({ teamId, challengeId });
  const Challenge = await CTF_challenges.findById(challengeId).lean();
  if (!Challenge) throw new Error("Challenge not found");
  if (!progress) {
    // create initial progress if missing (so team can use hint immediately)
    const initialHints = Array.isArray(Challenge.hints)
      ? Challenge.hints.map((h) => ({ hintId: h._id, used: false }))
      : [];
    await model.findOneAndUpdate(
      { teamId, challengeId },
      {
        $setOnInsert: {
          score: Challenge.score || 0,
          Flag_Submitted: false,
          hints: initialHints,
        },
      },
      { upsert: true }
    );
    // reload progress
    return model.getHint(teamId, challengeId, hintId, usedBy);
  }

  // ensure hints array exists
  if (!Array.isArray(progress.hints) || progress.hints.length === 0) {
    const initialHints = Array.isArray(Challenge.hints)
      ? Challenge.hints.map((h) => ({ hintId: h._id, used: false }))
      : [];
    await model.updateOne(
      { teamId, challengeId },
      { $set: { hints: initialHints } }
    );
    progress.hints = initialHints;
  }

  // Case 1: Flag already submitted -> mark used, do NOT reduce score
  if (progress.Flag_Submitted) {
    const hintExists = progress.hints.some(
      (h) => String(h.hintId) === String(hintId)
    );

    if (hintExists) {
      await model.updateOne(
        { teamId, challengeId, "hints.hintId": hintId },
        {
          $set: {
            "hints.$.used": true,
            "hints.$.usedBy": usedBy || progress.submittedBy || null,
            "hints.$.usedAt": new Date(),
          },
        }
      );
    } else {
      await model.updateOne(
        { teamId, challengeId },
        {
          $push: {
            hints: {
              hintId,
              used: true,
              usedBy: usedBy || null,
              usedAt: new Date(),
            },
          },
        }
      );
    }

    return model.fetchProgress(teamId, challengeId);
  }

  // Case 2: Flag not submitted -> can only unlock first locked hint and reduce score by hint.cost
  const firstLockedHint = progress.hints.find((h) => !h.used);
  if (!firstLockedHint) return model.fetchProgress(teamId, challengeId); // all used

  if (String(firstLockedHint.hintId) !== String(hintId)) {
    // only first locked hint may be unlocked
    return model.fetchProgress(teamId, challengeId);
  }

  // find cost from Challenge.hints
  let cost = 0;
  if (Array.isArray(Challenge.hints)) {
    const hd = Challenge.hints.find((h) => String(h._id) === String(hintId));
    if (hd && typeof hd.cost === "number") cost = hd.cost;
  }

  const update = {
    $set: {
      "hints.$.used": true,
      "hints.$.usedBy": usedBy || null,
      "hints.$.usedAt": new Date(),
    },
  };
  if (cost && typeof cost === "number")
    update.$inc = { score: -Math.abs(cost) };

  await model.updateOne(
    { teamId, challengeId, "hints.hintId": hintId },
    update
  );

  return model.fetchProgress(teamId, challengeId);
};

/**
 * Fetch team progress (returns progress merged with challenge metadata and populated hints)
 * returns object: { Flag_Submitted, Visited, ...progressFields, title, description, ... }
 */
CTFTeamSchema.statics.fetchProgress = async function (teamId, challengeId) {
  const model = this;

  // Load challenge once
  const Challenge = await CTF_challenges.findById(challengeId).lean();
  if (!Challenge) throw new Error("Challenge not found");

  // Try to find existing progress without populate for merging
  let exist = await model.findOne({ teamId, challengeId }).lean();

  if (exist) {
    // Build canonical hints array from Challenge (preserves challenge order)
    const canonicalHints = Array.isArray(Challenge.hints)
      ? Challenge.hints.map((h) => ({ hintId: h._id, used: false }))
      : [];

    // Map existing used flags by hintId for preservation
    const usedMap = {};
    if (Array.isArray(exist.hints)) {
      exist.hints.forEach((h) => {
        if (h && h.hintId)
          usedMap[String(h.hintId)] = {
            used: !!h.used,
            usedBy: h.usedBy || null,
            usedAt: h.usedAt || null,
          };
      });
    }

    // Merge: preserve used=true where hintId still present, default false for new ones
    const mergedHints = canonicalHints.map((h) => {
      const key = String(h.hintId);
      const prev = usedMap[key];
      return {
        hintId: h.hintId,
        used: !!(prev && prev.used),
        usedBy: prev && prev.usedBy ? prev.usedBy : null,
        usedAt: prev && prev.usedAt ? prev.usedAt : null,
      };
    });

    // Detect difference between stored exist.hints and mergedHints (normalize strings)
    const normalize = (arr) =>
      (arr || [])
        .map((x) => `${String(x.hintId)}|${x.used ? "1" : "0"}`)
        .join(",");
    const storedNormalized = normalize(exist.hints);
    const mergedNormalized = normalize(mergedHints);

    if (storedNormalized !== mergedNormalized) {
      // Update DB with the merged hints atomically
      await model.updateOne(
        { teamId, challengeId },
        { $set: { hints: mergedHints } }
      );
    }

    // Now fetch with populate
    exist = await model
      .findOne({ teamId, challengeId })
      .populate("submittedBy", "username")
      .populate("hints.usedBy", "username")
      .lean();

    // populate hints for response
    const doc = await _populateHints(exist, Challenge);

    const data = {
      ...doc,
      submittedBy: exist.submittedBy ? exist.submittedBy.username : null,
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

  // Create new team progress and initialize hints from Challenge.hints
  const initialHints = Array.isArray(Challenge.hints)
    ? Challenge.hints.map((h) => ({ hintId: h._id, used: false }))
    : [];

  let newProgress = await model
    .findOneAndUpdate(
      { teamId, challengeId },
      {
        $setOnInsert: {
          score: Challenge.score || 0,
          Flag_Submitted: false,
          hints: initialHints,
        },
      },
      { new: true, upsert: true }
    )
    .populate("submittedBy", "username")
    .populate("hints.usedBy", "username")
    .lean();

  const doc = await _populateHints(newProgress, Challenge);
  const data = {
    ...doc,
    submittedBy: newProgress.submittedBy
      ? newProgress.submittedBy.username
      : null,
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

/**
 * Validate flag submitted on behalf of team.
 * - If correct: set Flag_Submitted = true and set submittedBy (user who submitted)
 * - attempt counting logic included
 *
 * returns an object { updated, created, correct, Challenge }
 */
CTFTeamSchema.statics.validateFlag = async function (
  teamId,
  challengeId,
  Flag,
  submittedBy = null
) {
  const model = this;
  const challenge = await CTF_challenges.findById(challengeId).lean();
  if (!challenge)
    return { updated: false, created: false, correct: false, Challenge: false };

  const submittedFlag = String(Flag).trim();
  const correctFlag = String(challenge.flag).trim();

  // Attempt to find progress doc
  let progress = await model.findOne({ teamId, challengeId });
  let created = false;
  if (!progress) {
    created = true;
    // create a progress doc first (so attempts tracked)
    const initialHints = Array.isArray(challenge.hints)
      ? challenge.hints.map((h) => ({ hintId: h._id, used: false }))
      : [];
    progress = await model.findOneAndUpdate(
      { teamId, challengeId },
      {
        $setOnInsert: {
          score: challenge.score || 0,
          Flag_Submitted: false,
          hints: initialHints,
        },
      },
      { new: true, upsert: true }
    );
  }

  if (progress.Flag_Submitted || progress.attempt >= Flag_attempt) {
    return {
      updated: false,
      created,
      correct: false,
      Challenge: await model
        .findById(progress._id)
        .populate("submittedBy", "username")
        .populate("hints.usedBy", "username")
        .lean(),
    };
  }

  if (submittedFlag === correctFlag) {
    const updatedDoc = await model
      .findOneAndUpdate(
        { _id: progress._id },
        {
          $set: {
            Flag_Submitted: true,
            submittedBy: submittedBy || progress.submittedBy || null,
          },
        },
        { new: true }
      )
      .populate("submittedBy", "username")
      .populate("hints.usedBy", "username")
      .lean();
    return {
      updated: true,
      created,
      correct: true,
      Challenge: updatedDoc,
    };
  } else {
    const updatedDoc = await model
      .findOneAndUpdate(
        { _id: progress._id },
        { $inc: { attempt: 1 } },
        { new: true }
      )
      .populate("submittedBy", "username")
      .populate("hints.usedBy", "username")
      .lean();
    return {
      updated: true,
      created,
      correct: false,
      Challenge: updatedDoc,
    };
  }
};

module.exports = mongoose.model("CTF_Teamprogress", CTFTeamSchema);
