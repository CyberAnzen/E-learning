const mongoose = require("mongoose");
const LessonModel = require("../../../model/LessonModel");

exports.answerValidation = async (req, res) => {
  const { input, questionId, lessonId } = req.body;

  try {
    // 1. Validate request body
    if (input === undefined || questionId == null || lessonId == null) {
      return res
        .status(400)
        .json({ message: "input, questionId and lessonId are all required" });
    }

    // 2. Fetch the lesson
    const lesson = await LessonModel.findById(lessonId).lean();
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // 3. Ensure tasks.content is iterable
    if (!lesson.tasks || !Array.isArray(lesson.tasks.content)) {
      return res
        .status(500)
        .json({ message: "Lesson format invalid: no tasks.content array" });
    }

    // 4. Find the question by ID
    let foundQuestion = null;
    for (const section of lesson.tasks.content) {
      if (!Array.isArray(section.questions)) continue;
      for (const question of section.questions) {
        if (question._id.toString() === questionId) {
          foundQuestion = question;
          break;
        }
      }
      if (foundQuestion) break;
    }

    if (!foundQuestion) {
      return res.status(404).json({ message: "Question not found in lesson" });
    }

    // 5. Validate the answer based on question type
    let valid = false;
    let correctAnswerPayload;

    switch (foundQuestion.type) {
      case "text":
        correctAnswerPayload = foundQuestion.correctAnswers || [];
        valid =
          Array.isArray(foundQuestion.correctAnswers) &&
          foundQuestion.correctAnswers.some(
            (ans) =>
              ans.trim().toLowerCase() === String(input).trim().toLowerCase()
          );
        break;

      case "multiple-choice":
        correctAnswerPayload = foundQuestion.correctAnswer;
        valid = foundQuestion.correctAnswer === input;
        break;

      case "multiple-select":
        correctAnswerPayload = foundQuestion.correctAnswers || [];
        if (!Array.isArray(input)) {
          return res.status(400).json({
            message: "For multiple-select questions, input must be an array",
          });
        }
        const userSorted = [...input].sort();
        const correctSorted = [...foundQuestion.correctAnswers].sort();
        valid =
          userSorted.length === correctSorted.length &&
          userSorted.every((val, idx) => val === correctSorted[idx]);
        break;

      default:
        return res.status(400).json({ message: "Unknown question type" });
    }

    // 6. Return the result including the correct answer(s)
    return res.status(200).json({
      lessonId,
      questionId,
      valid,
      correctAnswer: correctAnswerPayload,
    });
  } catch (error) {
    console.error("answerValidation error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
