// models/UserLessonProgress.js
const mongoose = require("mongoose");

const UserLessonProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    classificationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Classifications",
      required: true,
      index: true,
    },
    lessonId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Lessons",
      required: true,
      index: true,
    },
    highestScore: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ensure uniqueness per user+lesson
UserLessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model("UserLessonProgress", UserLessonProgressSchema);
