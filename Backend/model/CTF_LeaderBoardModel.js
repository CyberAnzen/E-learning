const mongoose = require("mongoose");
const { Schema } = mongoose;
const Flag_attempt = Number(process.env.Flag_Attemtps) || 5;
const CTF_challenges = require("./CTFchallengeModel");
const ProgressSchema = new Schema(
  {
    identifierName: {
      type: String,
      required: [true, "identifierId is required"],
      validate: {
        validator: (v) => v != null,
        message: "identifierId cannot be null",
      },
      index: true,
    },
    identifierId: {
      type: Schema.Types.ObjectId,
      required: [true, "identifierId is required"],
      validate: {
        validator: (v) => v != null,
        message: "identifierId cannot be null",
      },
      index: true,
    },

    total_score: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    identifier: {
      type: String,
      enum: ["solo", "team"],
      required: true,
    },

    challengesCompleted: [
      {
        ChallengeId: {
          type: Schema.Types.ObjectId,
          ref: "CTF_challenges",
          required: [true, "ChallengeId is required"],
          validate: {
            validator: (v) => v != null,
            message: "ChallengeId cannot be null",
          },
        },
        ObtainedScore: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

//  Dynamic validation: ensure identifierId points to correct model
ProgressSchema.pre("save", async function (next) {
  try {
    if (this.identifier === "team") {
      const exists = await mongoose
        .model("Teams")
        .exists({ _id: this.identifierId });
      if (!exists) throw new Error("Invalid teamId reference");
    } else if (this.identifier === "solo") {
      const exists = await mongoose
        .model("Users")
        .exists({ _id: this.identifierId });
      if (!exists) throw new Error("Invalid userId reference");
    }
    next();
  } catch (err) {
    next(err);
  }
});

CTF_LeaderBoardSchema.statics.updateScore = async (
  identifierId,
  identifier,
  scoreGained
) => {};

module.exports = mongoose.model("CTF_LeaderBoard", CTF_LeaderBoardSchema);
