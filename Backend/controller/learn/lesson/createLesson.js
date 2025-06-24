const LessonModel = require("../../../model/LessonModel");
const ClassificationModel = require("../../../model/ClassificationModel");

exports.createLesson = async (req, res) => {
  try {
    const { classificationId, lessonNum } = req.body;

    if (!classificationId) {
      return res.status(400).json({ message: "classificationId is required" });
    }

    const classification = await ClassificationModel.exists({
      _id: classificationId,
    });

    if (!classification) {
      return res.status(404).json({ message: "Invalid classificationId" });
    }
    const exists = await LessonModel.LessonNumberValidation(
      classificationId,
      lessonNum
    );
    if (exists) {
      return res.status(400).json({
        message: "Lesson number already exists in this classification.",
      });
    }
    const lesson = await LessonModel.create(req.body);

    if (!lesson) {
      return res.status(500).json({ message: "Failed to create lesson" });
    }

    res.status(200).json({ message: "Lesson created successfully", lesson });
  } catch (error) {
    res.status(400).json({ message: "Lesson Not Created", error });
  }
};
