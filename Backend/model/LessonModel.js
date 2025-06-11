const mongoose = require("mongoose");

const ContentSchema = require("../schema/ContentSchema");
const TaskSchema = require("../schema/TaskSchema");
const LessonModel = new mongoose.Schema(
  {
    classificationId: { type: ObjectId, required: true },
    lessonNum: { type: Number, required: true },
    lesson: { type: String, required: true },
    icon: String,
    content: ContentSchema,
    tasks: TaskSchema,
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lessons", LessonModel);

module.exports = { Lesson };
