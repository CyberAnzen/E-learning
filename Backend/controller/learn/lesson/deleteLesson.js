const LessonModel = require("../../../model/LessonModel");

exports.deleteLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await LessonModel.findByIdAndDelete(id);
    if (!lesson)
      return res.status(500).json({ message: "Lesson is not deleted" });
    res.status(200).json({ data: lesson });
  } catch (error) {
    res.status(404).json({ message: "Failed in deleting lesson" });
  }
};
