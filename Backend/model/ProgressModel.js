const mongoose = require("mongoose");
const ProgressSchema = require("../schema/ProgressSchema");
const ProgressModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Users",
      required: true,
      index: true, // fast queries by user
    },
    learn: { ProgressSchema },
  },
  {
    timestamps: true,
  }
);
ProgressModel.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", ProgressModel);
