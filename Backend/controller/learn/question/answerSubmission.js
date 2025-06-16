const LessonModel = require("../../../model/LessonModel");

// Enhanced normalization function
const normalize = (str) => {
  if (str === null || str === undefined) return "";
  if (typeof str !== "string") str = String(str);

  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ");
};

// Validation logic with improved text handling
const validateAnswer = (question, userAnswer) => {
  let isCorrect = false;
  let correctAnswerPayload = null;
  let explanation = question.explanation || "";

  switch (question.type) {
    case "text":
      // Handle various correct answer formats
      const correctAnswers = Array.isArray(question.correctAnswers)
        ? question.correctAnswers
        : question.correctAnswer
        ? [question.correctAnswer]
        : [];

      // Normalize all correct answers
      const normalizedCorrectAnswers = correctAnswers
        .map(normalize)
        .filter((a) => a);
      const normalizedUserAnswer = normalize(userAnswer);

      isCorrect = normalizedCorrectAnswers.includes(normalizedUserAnswer);
      correctAnswerPayload = correctAnswers[0] || "";
      break;

    case "multiple-choice":
      if (typeof userAnswer !== "string") {
        throw new Error(
          "For multiple-choice questions, answer must be a string"
        );
      }
      correctAnswerPayload = question.correctAnswer;
      isCorrect = normalize(userAnswer) === normalize(question.correctAnswer);
      break;

    case "multiple-select":
      if (!Array.isArray(userAnswer)) {
        throw new Error(
          "For multiple-select questions, answer must be an array"
        );
      }
      correctAnswerPayload = question.correctAnswers || [];

      // Normalize and sort both arrays
      const userNormalized = userAnswer.map(normalize).sort();
      const correctNormalized = correctAnswerPayload.map(normalize).sort();

      isCorrect =
        userNormalized.length === correctNormalized.length &&
        userNormalized.every((val, i) => val === correctNormalized[i]);
      break;

    default:
      throw new Error("Unknown question type");
  }

  return { isCorrect, explanation, correctAnswer: correctAnswerPayload };
};

// Submission controller
exports.answerSubmission = async (req, res) => {
  const { lessonId, answers, startTime } = req.body;

  // Validate request body
  if (!lessonId || typeof lessonId !== "string") {
    return res.status(400).json({ message: "Valid lessonId is required" });
  }
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return res.status(400).json({ message: "answers must be an object" });
  }
  if (!startTime || typeof startTime !== "number") {
    return res.status(400).json({ message: "Valid startTime is required" });
  }

  try {
    // Fetch the lesson
    const lesson = await LessonModel.findById(lessonId).lean();
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Extract sections from the lesson
    const sections = [];
    if (
      lesson.tasks &&
      lesson.tasks.content &&
      Array.isArray(lesson.tasks.content)
    ) {
      sections.push(...lesson.tasks.content);
    } else {
      console.warn(`Lesson ${lessonId} has unexpected tasks structure`);
    }

    // Collect all questions
    const allQuestions = [];
    sections.forEach((section) => {
      if (section.questions && Array.isArray(section.questions)) {
        section.questions.forEach((question) => {
          allQuestions.push({
            ...question,
            id: question._id.toString(),
          });
        });
      }
    });

    // Create question ID map for direct lookup
    const questionMap = {};
    allQuestions.forEach((question) => {
      questionMap[question.id] = question;
    });

    const results = {};
    let score = 0;

    // Process answers using question IDs
    Object.entries(answers).forEach(([questionId, userAnswer]) => {
      const question = questionMap[questionId];

      if (!question) {
        results[questionId] = {
          isCorrect: false,
          explanation: `Question ID ${questionId} not found in lesson`,
          correctAnswer: null,
        };
        return;
      }

      try {
        const validationResult = validateAnswer(question, userAnswer);
        results[questionId] = validationResult;
        if (validationResult.isCorrect) score++;
      } catch (error) {
        results[questionId] = {
          isCorrect: false,
          explanation: error.message,
          correctAnswer:
            question.correctAnswer || question.correctAnswers || null,
        };
      }
    });

    const totalQuestions = allQuestions.length;
    const percentage =
      totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const timeSpent = Date.now() - startTime;

    return res.status(200).json({
      score,
      totalQuestions,
      percentage,
      results,
      timeSpent,
    });
  } catch (error) {
    console.error("submitAssessment error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
