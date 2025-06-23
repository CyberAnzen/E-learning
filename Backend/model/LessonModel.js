const mongoose = require("mongoose");

const ContentSchema = require("../schema/ContentSchema");
const TaskSchema = require("../schema/TaskSchema");
const icons = [
  "Learning",
  "Tech",
  "Cybersecurity",
  "Coding",
  "Knowledge",
  "Brain",
  "Ideas",
  "Networks",
  "Code",
  "Books",
  "Web",
  "Server",
  "Security",
  "Bulb",
];

const LessonModel = new mongoose.Schema(
  {
    classificationId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Classification",
    },
    lessonNum: { type: Number, required: true, unique: true },
    lesson: { type: String, required: true, unique: true },
    icon: {
      type: String,
      enum: icons,
      required: true,
    },
    content: ContentSchema,
    tasks: TaskSchema,
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lessons", LessonModel);

module.exports = Lesson;
