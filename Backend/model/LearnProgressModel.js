const mongoose = require("mongoose");
const Types = mongoose.Types;

const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Users",
      required: true,
      index: true, // fast queries by user
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
      default: null,
      min: [0, "Score must be at least 0"],
      max: [100, "Score cannot exceed 100"],
    },
  },
  {
    timestamps: true,
  }
);

// Composite unique index: prevent duplicate progress entries for same lesson/user
ProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// STATIC: get completed lessons for a user in a classification
ProgressSchema.statics.getCompletedLessons = function (
  userId,
  classificationId
) {
  return this.find({
    userId: new Types.ObjectId(userId),
    classificationId: new Types.ObjectId(classificationId),
    highestScore: { $ne: null },
  })
    .select("lessonId highestScore -_id")
    .lean()
    .exec()
    .then((lessons) => ({ count: lessons.length, lessons }));
};

// STATIC: count completed lessons per classification (with lookup)
ProgressSchema.statics.countCompletedPerClassification = function (userId) {
  return this.model("Classifications").aggregate([
    {
      $lookup: {
        from: this.collection.name, // dynamically use the Progress model's collection name
        let: { classId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$classificationId", "$$classId"] },
                  { $eq: ["$userId", new Types.ObjectId(userId)] },
                  { $ne: ["$highestScore", null] }, // only completed
                ],
              },
            },
          },
        ],
        as: "userProgress",
      },
    },
    {
      $project: {
        classificationId: "$_id",
        totalCompleted: { $size: "$userProgress" },
      },
    },
  ]);
};

module.exports = mongoose.model("Learn_Progress", ProgressSchema);
