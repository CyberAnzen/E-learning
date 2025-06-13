const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const classificationSchema = new Schema(
  {
    title: { type: String, unique: true, required: true },
    description: String,
    icon: String,
    category: String,
  },
  {
    timestamps: true,
  }
);

// STATIC: count how many lessons reference this classification
classificationSchema.statics.countLessons = function (classificationId) {
  return this.model("Lessons")
    .countDocuments({
      classificationId: new Types.ObjectId(classificationId),
    })
    .exec();
};

// STATIC: fetch all lessons (only _id, lessonNum, and lesson title) for this classification
classificationSchema.statics.getLessonsSummary = function (classificationId) {
  return this.model("Lessons")
    .find(
      { classificationId: new Types.ObjectId(classificationId) },
      { _id: 1, lessonNum: 1, lesson: 1 }
    )
    .sort({ lessonNum: 1 })
    .lean()
    .exec();
};

module.exports = mongoose.model("Classification", classificationSchema);
