import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronLeft,
  Send,
  Terminal,
  AlertCircle,
  Lightbulb,
  HelpCircle,
  Clock,
  Trophy,
  Target,
  Zap,
  Award,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

const VALIDATE_ENDPOINT = "/api/validate-answer";
const SUBMIT_ENDPOINT = "/api/submit-assessment";

export const validateAnswer = async (questionId, answer) => {
  try {
    const response = await fetch(VALIDATE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionId, answer }),
    });

    if (!response.ok) {
      throw new Error("Validation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Validation error:", error);
    return {
      isCorrect: false,
      explanation: "Validation failed. Please try again.",
    };
  }
};

export const submitAssessment = async (answers, startTime) => {
  try {
    const response = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers, startTime }),
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

const QuestionInterface = ({
  isOpen,
  onClose,
  questions = [],
  taskId,
  ip = "192.168.1.100",
  chapterId = "ch1",
  chapterPath = "cybersec/basics",
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [startTime] = useState(Date.now());
  const [localAnswer, setLocalAnswer] = useState("");
  const [localSelectedOptions, setLocalSelectedOptions] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswerState = answers[currentQuestion?.id];

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ fullscreenReader: true }, "");
      const handlePopState = () => onClose();
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setShowHint(false);
      setAnswers({});
      setAssessmentResult(null);
      setLocalAnswer("");
      setLocalSelectedOptions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentQuestion) {
      const answerState = answers[currentQuestion.id];

      if (
        currentQuestion.type === "text" ||
        currentQuestion.type === "multiple-choice"
      ) {
        setLocalAnswer(answerState?.value || "");
        setLocalSelectedOptions([]);
      } else if (currentQuestion.type === "multiple-select") {
        setLocalAnswer("");
        setLocalSelectedOptions(answerState?.value || []);
      }
      setShowHint(false);
    }
  }, [currentQuestionIndex, currentQuestion, answers]);

  useEffect(() => {
    if (questions.length === 0) return;

    const answeredQuestions = Object.keys(answers).filter(
      (id) => answers[id].validation && !answers[id].isValidating
    );

    if (answeredQuestions.length === questions.length && !assessmentResult) {
      handleCompleteAssessment();
    }
  }, [answers, questions, assessmentResult]);

  const handleAnswerSubmission = async (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        value: answer,
        isValidating: true,
        isLocked: false,
      },
    }));

    try {
      const validation = await validateAnswer(questionId, answer);

      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          value: answer,
          isValidating: false,
          validation,
          isLocked: true,
        },
      }));
    } catch (error) {
      console.error("Error validating answer:", error);
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          value: answer,
          isValidating: false,
          isLocked: false,
        },
      }));
    }
  };

  const handleTextAnswerSubmit = () => {
    if (
      localAnswer.trim() &&
      (!currentAnswerState || !currentAnswerState.isLocked)
    ) {
      handleAnswerSubmission(currentQuestion.id, localAnswer.trim());
    }
  };

  const handleMultipleChoiceChange = (option) => {
    if (currentAnswerState?.isLocked) return;

    setLocalAnswer(option);
    handleAnswerSubmission(currentQuestion.id, option);
  };

  const handleMultipleSelectChange = (option) => {
    if (currentAnswerState?.isLocked) return;

    const newSelection = localSelectedOptions.includes(option)
      ? localSelectedOptions.filter((item) => item !== option)
      : [...localSelectedOptions, option];

    setLocalSelectedOptions(newSelection);
  };

  const handleMultipleSelectSubmit = () => {
    if (
      localSelectedOptions.length > 0 &&
      (!currentAnswerState || !currentAnswerState.isLocked)
    ) {
      handleAnswerSubmission(currentQuestion.id, localSelectedOptions);
    }
  };

  const handleCompleteAssessment = async () => {
    setIsSubmittingAssessment(true);

    try {
      const submissionAnswers = {};
      Object.entries(answers).forEach(([questionId, answerState]) => {
        submissionAnswers[questionId] = answerState.value;
      });

      const result = await submitAssessment(submissionAnswers, startTime);
      setAssessmentResult(result);
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setIsSubmittingAssessment(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const resetAssessment = () => {
    setAnswers({});
    setAssessmentResult(null);
    setCurrentQuestionIndex(0);
    setLocalAnswer("");
    setLocalSelectedOptions([]);
  };

  const renderAnswerInput = () => {
    const isLocked = currentAnswerState?.isLocked;
    const isValidating = currentAnswerState?.isValidating;
    const validation = currentAnswerState?.validation;

    if (currentQuestion.type === "text") {
      return (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={localAnswer}
              onChange={(e) => setLocalAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className={`w-full p-4 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none transition-all duration-300 ${
                isLocked
                  ? "border-gray-500/50 cursor-not-allowed opacity-75"
                  : "border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              }`}
              rows={4}
              disabled={isLocked}
            />
            {isValidating && (
              <div className="absolute top-4 right-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"
                />
              </div>
            )}
          </div>
          {!isLocked && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTextAnswerSubmit}
              disabled={!localAnswer.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25"
            >
              <Send className="w-4 h-4" />
              Submit Answer
            </motion.button>
          )}
        </div>
      );
    } else if (currentQuestion.type === "multiple-choice") {
      return (
        <div className="space-y-3">
          {currentQuestion.options?.map((option, index) => {
            const isSelected = localAnswer === option;
            const isCorrectOption = validation?.correctAnswer === option;
            const isIncorrectSelection =
              isLocked && isSelected && !validation?.isCorrect;

            return (
              <motion.label
                key={index}
                whileHover={!isLocked ? { scale: 1.01 } : {}}
                whileTap={!isLocked ? { scale: 0.99 } : {}}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  isLocked
                    ? isCorrectOption
                      ? "border-green-500/50 bg-green-500/10 backdrop-blur-sm"
                      : isIncorrectSelection
                      ? "border-red-500/50 bg-red-500/10 backdrop-blur-sm"
                      : "border-white/10 bg-white/5 backdrop-blur-sm opacity-60"
                    : isSelected
                    ? "border-blue-500/50 bg-blue-500/10 backdrop-blur-sm"
                    : "border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
                } ${isLocked ? "cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => handleMultipleChoiceChange(option)}
                  disabled={isLocked}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isLocked
                      ? isCorrectOption
                        ? "border-green-500 bg-green-500 shadow-lg shadow-green-500/25"
                        : isIncorrectSelection
                        ? "border-red-500 bg-red-500 shadow-lg shadow-red-500/25"
                        : "border-gray-400"
                      : isSelected
                      ? "border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/25"
                      : "border-gray-400"
                  }`}
                >
                  {((isLocked && isCorrectOption) ||
                    (!isLocked && isSelected)) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-white"
                    />
                  )}
                  {isLocked && isIncorrectSelection && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-white"
                    />
                  )}
                </div>
                <span
                  className={`flex-1 ${
                    isLocked
                      ? isCorrectOption
                        ? "text-green-300 font-medium"
                        : isIncorrectSelection
                        ? "text-red-300"
                        : "text-gray-400"
                      : "text-white"
                  }`}
                >
                  {option}
                </span>
                {isLocked && isCorrectOption && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                {isLocked && isIncorrectSelection && (
                  <X className="w-5 h-5 text-red-400" />
                )}
              </motion.label>
            );
          })}
          {isValidating && (
            <div className="flex items-center justify-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
              />
              <span className="ml-3 text-blue-400">Validating answer...</span>
            </div>
          )}
        </div>
      );
    } else if (currentQuestion.type === "multiple-select") {
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = localSelectedOptions.includes(option);
              const correctAnswers = validation?.correctAnswer || [];
              const isCorrectOption = correctAnswers.includes(option);
              const isIncorrectSelection =
                isLocked && isSelected && !isCorrectOption;

              return (
                <motion.label
                  key={index}
                  whileHover={!isLocked ? { scale: 1.01 } : {}}
                  whileTap={!isLocked ? { scale: 0.99 } : {}}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    isLocked
                      ? isCorrectOption
                        ? "border-green-500/50 bg-green-500/10 backdrop-blur-sm"
                        : isIncorrectSelection
                        ? "border-red-500/50 bg-red-500/10 backdrop-blur-sm"
                        : "border-white/10 bg-white/5 backdrop-blur-sm opacity-60"
                      : isSelected
                      ? "border-green-500/50 bg-green-500/10 backdrop-blur-sm"
                      : "border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
                  } ${isLocked ? "cursor-not-allowed" : ""}`}
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={isSelected}
                    onChange={() => handleMultipleSelectChange(option)}
                    disabled={isLocked}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                      isLocked
                        ? isCorrectOption
                          ? "border-green-500 bg-green-500 shadow-lg shadow-green-500/25"
                          : isIncorrectSelection
                          ? "border-red-500 bg-red-500 shadow-lg shadow-red-500/25"
                          : "border-gray-400"
                        : isSelected
                        ? "border-green-500 bg-green-500 shadow-lg shadow-green-500/25"
                        : "border-gray-400"
                    }`}
                  >
                    {((isLocked && isCorrectOption) ||
                      (!isLocked && isSelected)) && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                    {isLocked && isIncorrectSelection && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <X className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <span
                    className={`flex-1 ${
                      isLocked
                        ? isCorrectOption
                          ? "text-green-300 font-medium"
                          : isIncorrectSelection
                          ? "text-red-300"
                          : "text-gray-400"
                        : "text-white"
                    }`}
                  >
                    {option}
                  </span>
                </motion.label>
              );
            })}
          </div>
          {!isLocked && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMultipleSelectSubmit}
              disabled={localSelectedOptions.length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-green-500/25"
            >
              <Send className="w-4 h-4" />
              Submit Selection
            </motion.button>
          )}
          {isValidating && (
            <div className="flex items-center justify-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full"
              />
              <span className="ml-3 text-green-400">
                Validating selection...
              </span>
            </div>
          )}
        </div>
      );
    }
  };

  const renderValidationFeedback = () => {
    const validation = currentAnswerState?.validation;
    if (!validation || currentAnswerState?.isValidating) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl backdrop-blur-sm border ${
          validation.isCorrect
            ? "bg-green-500/10 border-green-500/30"
            : "bg-red-500/10 border-red-500/30"
        }`}
      >
        <div
          className={`flex items-center gap-2 ${
            validation.isCorrect ? "text-green-400" : "text-red-400"
          }`}
        >
          {validation.isCorrect ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          <span className="font-medium">
            {validation.isCorrect ? "Correct!" : "Incorrect"}
          </span>
        </div>
        {validation.explanation && (
          <p
            className={`text-sm mt-2 ${
              validation.isCorrect ? "text-green-200" : "text-red-200"
            }`}
          >
            {validation.explanation}
          </p>
        )}
      </motion.div>
    );
  };

  const renderResultsScreen = () => {
    if (!assessmentResult) return null;

    const timeMinutes = Math.floor(assessmentResult.timeSpent / 60000);
    const timeSeconds = Math.floor((assessmentResult.timeSpent % 60000) / 1000);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/25"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white"
          >
            Assessment Complete!
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-8 text-gray-300"
          >
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span>
                {assessmentResult.score}/{assessmentResult.totalQuestions}{" "}
                Correct
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>{assessmentResult.percentage}% Score</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>
                {timeMinutes}m {timeSeconds}s
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {assessmentResult.score}
              </div>
              <div className="text-gray-400">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {assessmentResult.percentage}%
              </div>
              <div className="text-gray-400">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {timeMinutes}:{timeSeconds.toString().padStart(2, "0")}
              </div>
              <div className="text-gray-400">Time Taken</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            Question Breakdown
          </h3>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const result = assessmentResult.results[question.id];
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`p-4 rounded-xl border backdrop-blur-sm ${
                    result?.isCorrect
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        result?.isCorrect
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {result?.isCorrect ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium mb-2">
                        Question {index + 1}: {question.text}
                      </div>
                      {result?.explanation && (
                        <div
                          className={`text-sm ${
                            result.isCorrect ? "text-green-200" : "text-red-200"
                          }`}
                        >
                          {result.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetAssessment}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/10"
          >
            <X className="w-4 h-4" />
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };

  if (!isOpen || !currentQuestion) return null;

  const answeredCount = Object.keys(answers).filter(
    (id) => answers[id].validation && !answers[id].isValidating
  ).length;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (assessmentResult) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col"
        >
          <div className="flex-shrink-0 bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl backdrop-blur-sm border border-white/10">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-xl">
                    Assessment Results
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {assessmentResult.score}/{assessmentResult.totalQuestions}{" "}
                    correct • {assessmentResult.percentage}% score
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {renderResultsScreen()}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (isSubmittingAssessment) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
            />
            <h3 className="text-white text-xl font-semibold mb-2">
              Processing Assessment
            </h3>
            <p className="text-gray-400">Calculating your results...</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col"
      >
        <div className="flex-shrink-0 bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-white/10">
                <Terminal className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-xl">
                  Interactive Assessment
                </h2>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Question {currentQuestionIndex + 1} of {questions.length}
                  <span className="text-green-400">
                    • {answeredCount} completed
                  </span>
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        <div className="flex-shrink-0 bg-black/10 backdrop-blur-sm px-6 py-3">
          <div className="flex gap-2">
            {questions.map((_, index) => {
              const questionId = questions[index].id;
              const isAnswered = answers[questionId]?.validation;
              const isCorrect = answers[questionId]?.validation?.isCorrect;

              return (
                <motion.div
                  key={index}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                    index === currentQuestionIndex
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
                      : isAnswered
                      ? isCorrect
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25"
                        : "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/25"
                      : "bg-white/10"
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex-shrink-0 bg-black/30 backdrop-blur-sm px-6 py-4 border-b border-white/5">
          <div className="font-mono text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-gray-500">┌──(</span>
              <span className="text-blue-400">student@assessment</span>
              <span className="text-gray-500">)-[</span>
              <span className="text-amber-400">~/{chapterPath}</span>
              <span className="text-gray-500">]</span>
            </div>
            <div className="flex items-center gap-2 text-green-400 mt-1">
              <span className="text-gray-500">└─</span>
              <span className="text-green-400">$</span>
              <span className="text-white ml-2 flex items-center gap-2">
                Connection: {ip}
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400">Auto-submit enabled</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    currentAnswerState?.validation
                      ? currentAnswerState.validation.isCorrect
                        ? "bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/25"
                        : "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25"
                      : "bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/25"
                  }`}
                >
                  {currentAnswerState?.validation ? (
                    currentAnswerState.validation.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <X className="w-5 h-5 text-white" />
                    )
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {currentQuestionIndex + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-3 leading-relaxed">
                    {currentQuestion.text}
                  </h3>

                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                        currentQuestion.type === "text"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : currentQuestion.type === "multiple-choice"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-green-500/20 text-green-300 border border-green-500/30"
                      }`}
                    >
                      {currentQuestion.type === "text" && "Free Text Response"}
                      {currentQuestion.type === "multiple-choice" &&
                        "Single Selection • Auto-submit"}
                      {currentQuestion.type === "multiple-select" &&
                        "Multiple Selection"}
                    </span>
                  </div>

                  {currentQuestion.hint && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={toggleHint}
                      className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm transition-colors bg-amber-500/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-amber-500/20"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHint ? "Hide Hint" : "Need a Hint?"}
                    </motion.button>
                  )}

                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-amber-500/10 backdrop-blur-sm border border-amber-500/30 rounded-xl"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <p className="text-amber-200 text-sm leading-relaxed">
                            {currentQuestion.hint}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-4">
                {renderAnswerInput()}
                {renderValidationFeedback()}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex-shrink-0 bg-black/20 backdrop-blur-md border-t border-white/10 px-6 py-4">
          <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-500 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>

            <div className="flex items-center gap-3">
              {questions.map((_, index) => {
                const questionId = questions[index].id;
                const answerState = answers[questionId];
                const isAnswered = answerState?.validation;
                const isCorrect = answerState?.validation?.isCorrect;

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${
                      index === currentQuestionIndex
                        ? "border-blue-500 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                        : isAnswered
                        ? isCorrect
                          ? "border-green-500 bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                          : "border-red-500 bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                        : "border-white/20 bg-white/5 text-gray-400 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    {isAnswered ? (
                      isCorrect ? (
                        <CheckCircle className="w-5 h-5 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={isLastQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-500 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed backdrop-blur-sm border border-white/10"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionInterface;
