const LessonModel = require("../../../model/LessonModel");
const ClassificationModel = require("../../../model/ClassificationModel");

exports.updateLesson = async (req, res) => {
  try {
    const { classificationId, _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "lessonId is required" });
    }

    if (!classificationId) {
      return res.status(400).json({ message: "classificationId is required" });
    }

    const classification = await ClassificationModel.exists({
      _id: classificationId,
    });

    if (!classification) {
      return res.status(404).json({ message: "Invalid classificationId" });
    }

    const updatedLesson = await LessonModel.findByIdAndUpdate(
      _id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ message: "Lesson updated successfully", lesson: updatedLesson });
  } catch (error) {
    res.status(400).json({ message: "Lesson update failed", error });
  }
};
