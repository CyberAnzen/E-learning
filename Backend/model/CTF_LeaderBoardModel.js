const mongoose = require("mongoose");
const { Schema } = mongoose;
const Flag_attempt = Number(process.env.Flag_Attemtps) || 5;
const CTF_challenges = require("./CTFchallengeModel");

const CTF_LeaderBoardSchema = new Schema(
  {
    identifierId: {
      type: Schema.Types.ObjectId,
      ref: "Teams",
      required: [true, "teamId is required"],
      validate: {
        validator: (v) => v != null,
        message: "teamId cannot be null",
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CTF_LeaderBoard", CTF_LeaderBoardSchema);
