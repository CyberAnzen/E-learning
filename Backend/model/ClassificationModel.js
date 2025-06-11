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

//
// STATIC: count how many lessons reference this classification
//
classificationSchema.statics.countLessons = function (classificationId) {
  // `this` is the Classification model
  return mongoose
    .model("Lesson")
    .countDocuments({ classificationId: Types.ObjectId(classificationId) })
    .exec();
};

//
// STATIC: fetch all lessons (only _id and lessonNum/title) for this classification
//
classificationSchema.statics.getLessonsSummary = function (classificationId) {
  return mongoose
    .model("Lesson")
    .find(
      { classificationId: Types.ObjectId(classificationId) },
      { _id: 1, lessonNum: 1, lesson: 1 }
    )
    .sort({ lessonNum: 1 })
    .lean()
    .exec();
};

module.exports = mongoose.model("Classification", classificationSchema);
