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
    lessonNum: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },
    lesson: { type: String, required: true },
    images_URL: [{ type: String }],
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

//-----------Static Function to validate the Lesson Number

// LessonModel.statics.LessonNumberValidation = async function (
//   classificationId,
//   lessonNum
// ) {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(classificationId)) {
//       throw new Error("Invalid classificationId format");
//     }

//     if (typeof lessonNum !== "number" || lessonNum <= 0) {
//       throw new Error("lessonNum must be a positive number");
//     }

//     const exists = await this.exists({
//       classificationId: classificationId,
//       lessonNum: lessonNum,
//     });

//     return Boolean(exists);
//   } catch (err) {
//     console.error("LessonNumberValidation error:", err.message);
//     return false;
//   }
// };

// //-----------Static Function to get the Next Lesson Number

// LessonModel.statics.getNextLessonNumber = async function (classificationId) {
//   const lastLesson = await this.findOne({
//     classificationId: new mongoose.Types.ObjectId(classificationId),
//   })
//     .sort({ lessonNum: -1 }) // highest lessonNum first
//     .select("lessonNum")
//     .lean();

//   return lastLesson ? lastLesson.lessonNum + 1 : 1;
// };


// unique lesson number per classification
LessonModel.index({ classificationId: 1, lessonNum: 1 }, { unique: true });
const Lesson = mongoose.model("Lessons", LessonModel);

module.exports = Lesson;
