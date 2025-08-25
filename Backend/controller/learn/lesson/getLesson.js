const LessonModel = require("../../../model/LessonModel");
const Learn_Progress = require("../../../model/LearnProgressModel");

/**
 * Recursively walks an object/array and deletes any
 * keys named `correctAnswer` or `correctAnswers`.
 */
function stripAnswers(node) {
  if (Array.isArray(node)) {
    node.forEach(stripAnswers);
  } else if (node && typeof node === "object") {
    delete node.correctAnswer;
    delete node.correctAnswers;
    Object.values(node).forEach(stripAnswers);
  }
}

exports.getLesson = async (req, res) => {
  const user = req.user;
  // rename params to JS‑style
  const { ClassificationId: classificationId, LessonId: lessonId } = req.params;

  try {
    const lesson = await LessonModel.findById(lessonId).lean(); // gives plain JS object

    // ensure correct classification
    if (
      !classificationId ||
      lesson.classificationId.toString() !== classificationId
    ) {
      return res.status(404).json({ message: "Missing or mismatched IDs" });
    }

    delete lesson.__v;

    if (user.role === "User") {
      stripAnswers(lesson.tasks);
      delete lesson.createdAt;
      delete lesson.updatedAt;
    }

    // **correct** lookup: use the schema field names
    const existingProgress = await Learn_Progress.findOne({
      userId: user.id,
      classificationId,
      lessonId,
    });

    if (!existingProgress) {
      await Learn_Progress.create({
        userId: user.id,
        classificationId,
        lessonId,
        highestScore: 0,
      });
    }

    return res.status(200).json({ data: lesson });
  } catch (error) {
    console.error("getLesson error:", error);
    return res.status(500).json({ message: "Failed to load lesson" });
  }
};
