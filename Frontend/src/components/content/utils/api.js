const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const VALIDATE_ENDPOINT = `${BACKEND_URL}/answer/validate`;
const SUBMIT_ENDPOINT = `${BACKEND_URL}/answer/submit`;

export const validateAnswer = async (
  lessonId,
  questionId,
  answer,
  csrf,
  fp
) => {
  try {
    const response = await fetch(VALIDATE_ENDPOINT, {
      method: "POST",
      credentials: "include", // important line

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-client-fp": fp,
        "csrf-token": csrf,
        timestamp: Date.now(),
      },
      body: JSON.stringify({
        lessonId,
        questionId,
        input: answer,
      }),
    });

    if (!response.ok) {
      throw new Error("Validation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Validation error:", error);
    return {
      isCorrect: false,
      correctAnswer: null,
      explanation: "Validation failed. Please try again.",
    };
  }
};

export const submitAssessment = async (
  lessonId,
  answers,
  startTime,
  csrf,
  fp
) => {
  try {
    const response = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      credentials: "include", // important line

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-client-fp": fp,
        "csrf-token": csrf,
        timestamp: Date.now(),
      },
      body: JSON.stringify({
        lessonId,
        answers,
        startTime,
      }),
    });

    if (!response.ok) {
      throw new Error("Submission failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Submission error:", error);
    return {
      score: 0,
      totalQuestions: Object.keys(answers).length,
      percentage: 0,
      results: {},
      timeSpent: Date.now() - startTime,
    };
  }
};
