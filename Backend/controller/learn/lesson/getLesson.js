const LessonModel = require("../../../model/LessonModel");

exports.getLesson = async (req, res) => {
  const { ClassificationId, LessonId } = req.params;

  try {
    const lesson = await LessonModel.findById(LessonId).lean(); // lean makes it a plain object

    // Fix: compare ObjectId with string correctly
    if (
      !ClassificationId ||
      lesson.classificationId.toString() !== ClassificationId
    ) {
      return res.status(404).json({ message: "Failed in loading lesson" });
    }

    // Remove unwanted fields
    if (lesson.tasks?.content?.length) {
      lesson.tasks.content = lesson.tasks.content.map((taskItem) => {
        if (taskItem.questions?.length) {
          taskItem.questions = taskItem.questions.map((q) => {
            const { correctAnswer, correctAnswers, ...rest } = q;
            return rest;
          });
        }
        return taskItem;
      });
    }

    delete lesson.__v;
    delete lesson.createdAt;
    delete lesson.updatedAt;

    return res.status(200).json({ data: lesson });
  } catch (error) {
    res.status(404).json({ message: "Failed in loading lesson" });
  }
};
