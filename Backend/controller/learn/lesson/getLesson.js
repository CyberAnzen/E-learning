const LessonModel = require("../../../model/LessonModel");

exports.getLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await LessonModel.findById(id).lean(); // lean makes it a plain object

    if (!lesson)
      return res.status(500).json({ message: "Lesson is not fetched" });

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

    res.status(200).json({ data: lesson });
  } catch (error) {
    res.status(404).json({ message: "Failed in loading lesson" });
  }
};
