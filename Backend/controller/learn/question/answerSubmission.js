const LessonModel = require("../../../model/LessonModel");
const Learn_Progress = require("../../../model/LearnProgressModel");
// Enhanced normalization function

const normalize = (str) => {
  if (str === null || str === undefined) return "";
  if (typeof str !== "string") str = String(str);

  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\w]/g, ""); // Removes non-alphanumeric characters, including spaces
};

// Validation logic with improved text handling
const validateAnswer = (question, userAnswer) => {
  let isCorrect = false;
  let correctAnswerPayload = null;
  let explanation = question.explanation || "";

  switch (question.type) {
    case "text":
      // Handle correct answer (prioritize string format)
      const correctAnswer = question.correctAnswer || "";

      // Normalize both correct answer and user input
      const normalizedCorrect = normalize(correctAnswer);
      const normalizedUser = normalize(userAnswer);
      // console.log(normalizedCorrect);

      // Check for empty correct answer after normalization
      if (!normalizedCorrect) {
        // console.log(normalizedCorrect)
        isCorrect = false;
        correctAnswerPayload = correctAnswer;
        break;
      }

      // Compare normalized values
      isCorrect = normalizedCorrect === normalizedUser;
      correctAnswerPayload = correctAnswer;
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
  const user = req.user;
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
    const classificationId = lesson.classificationId;
    // Collect all questions directly from lesson.tasks.content.questions
    const allQuestions = [];
    if (
      lesson.tasks &&
      lesson.tasks.content &&
      Array.isArray(lesson.tasks.content.questions)
    ) {
      lesson.tasks.content.questions.forEach((question) => {
        allQuestions.push({
          ...question,
          id: question._id.toString(),
        });
      });
    } else {
      console.warn(`Lesson ${lessonId} has unexpected tasks structure`);
      return res.status(400).json({ message: "Invalid lesson structure" });
    }

    // Ensure there are questions to process
    if (allQuestions.length === 0) {
      return res
        .status(400)
        .json({ message: "No questions found in the lesson" });
    }

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
    await Learn_Progress.updateCompletedLessons(
      user.id,
      classificationId,
      lessonId,
      score
    );

    res.status(200).json({
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
