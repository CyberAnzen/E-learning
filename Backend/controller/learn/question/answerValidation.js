const LessonModel = require("../../../model/LessonModel");

exports.answerValidation = async (req, res) => {
  const { input, questionId, lessonId } = req.body;

  if (input === undefined || input === null) {
    return res.status(400).json({ message: "Input is required" });
  }

  if (!questionId || !lessonId) {
    return res
      .status(400)
      .json({ message: "questionId and lessonId are required" });
  }

  try {
    const lesson = await LessonModel.findOne(
      { _id: lessonId, "tasks.content.questions._id": questionId },
      { "tasks.content.$": 1 }
    ).lean();

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const question = lesson.tasks.content[0]?.questions?.find(
      (q) => q._id.toString() === questionId
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const normalize = (str) => {
      if (typeof str !== "string") return String(str);
      return str
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, " ");
    };

    let isCorrect = false;
    let correctAnswerPayload = null;

    switch (question.type) {
      case "text":
        // Support either `correctAnswer` or `correctAnswers`
        const correctAnswer =
          typeof question.correctAnswer === "string"
            ? question.correctAnswer
            : Array.isArray(question.correctAnswers) &&
              question.correctAnswers.length > 0
            ? question.correctAnswers[0]
            : null;

        if (!correctAnswer) {
          return res
            .status(400)
            .json({ message: "No correct answer found for text question" });
        }

        correctAnswerPayload = correctAnswer;
        isCorrect = normalize(input) === normalize(correctAnswer);
        break;

      case "multiple-choice":
        correctAnswerPayload = question.correctAnswer;
        isCorrect = normalize(input) === normalize(correctAnswerPayload);
        break;

      case "multiple-select":
        correctAnswerPayload = question.correctAnswers || [];

        if (!Array.isArray(input)) {
          return res.status(400).json({
            message: "For multiple-select questions, input must be an array",
          });
        }

        const userNormalized = input.map(normalize).sort();
        const correctNormalized = correctAnswerPayload.map(normalize).sort();

        isCorrect =
          userNormalized.length === correctNormalized.length &&
          userNormalized.every((val, i) => val === correctNormalized[i]);
        break;

      default:
        return res.status(400).json({ message: "Unknown question type" });
    }

    return res.status(200).json({
      isCorrect,
      correctAnswer: correctAnswerPayload,
      explanation: question.explanation || "",
    });
  } catch (error) {
    console.error("answerValidation error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
