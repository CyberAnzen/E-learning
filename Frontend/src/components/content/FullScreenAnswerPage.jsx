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
} from "lucide-react";

const FullscreenAnswerPage = ({
  isOpen,
  onClose,
  questions = [],
  answers,
  taskId,
  onAnswerSubmit,
  isSubmitted,
  ip,
  chapterId,
  chapterPath,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [localAnswer, setLocalAnswer] = useState("");
  const [localSelectedOptions, setLocalSelectedOptions] = useState([]);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const questionKey = `${taskId}-${currentQuestion?.id}`;

  // Handle escape key press to close
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Track browser back button: close modal instead of navigating away
  useEffect(() => {
    window.history.pushState({ fullscreenReader: true }, "");
    const handlePopState = (e) => {
      if (e.state && e.state.fullscreenReader) {
        onClose();
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      // No history.back() here, so clicking back just closes the modal
    };
  }, [onClose]);

  // Update local answer when switching questions or when answers prop changes
  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = answers[questionKey];

      if (currentQuestion.type === "text") {
        setLocalAnswer(existingAnswer || "");
        setLocalSelectedOptions([]);
      } else if (currentQuestion.type === "multiple-choice") {
        setLocalAnswer(existingAnswer || "");
        setLocalSelectedOptions([]);
      } else if (currentQuestion.type === "multiple-select") {
        setLocalAnswer("");
        setLocalSelectedOptions(existingAnswer || []);
      }

      setShowHint(false);
    }
  }, [currentQuestionIndex, currentQuestion, answers, questionKey]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setShowHint(false);
    }
  }, [isOpen]);

  const handleTextAnswerChange = (value) => {
    setLocalAnswer(value);
  };

  const handleMultipleChoiceChange = (option) => {
    setLocalAnswer(option);
  };

  const handleMultipleSelectChange = (option) => {
    setLocalSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleSubmitAnswer = () => {
    let answerToSubmit;

    if (
      currentQuestion.type === "text" ||
      currentQuestion.type === "multiple-choice"
    ) {
      answerToSubmit = localAnswer.trim();
    } else if (currentQuestion.type === "multiple-select") {
      answerToSubmit = localSelectedOptions;
    }

    if (
      answerToSubmit &&
      (typeof answerToSubmit === "string"
        ? answerToSubmit.length > 0
        : answerToSubmit.length > 0)
    ) {
      onAnswerSubmit(currentQuestion.id, answerToSubmit);
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

  const canSubmit = () => {
    if (
      currentQuestion.type === "text" ||
      currentQuestion.type === "multiple-choice"
    ) {
      return localAnswer.trim().length > 0;
    } else if (currentQuestion.type === "multiple-select") {
      return localSelectedOptions.length > 0;
    }
    return false;
  };

  const renderAnswerInput = () => {
    if (currentQuestion.type === "text") {
      return (
        <div className="relative">
          <textarea
            value={localAnswer}
            onChange={(e) => handleTextAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            rows={4}
            disabled={isSubmitted}
          />
          {isAnswered && (
            <div className="absolute top-3 right-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          )}
        </div>
      );
    } else if (currentQuestion.type === "multiple-choice") {
      return (
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                localAnswer === option
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 bg-gray-900/30 hover:border-gray-500"
              } ${isSubmitted ? "cursor-not-allowed opacity-75" : ""}`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={localAnswer === option}
                onChange={() => handleMultipleChoiceChange(option)}
                disabled={isSubmitted}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  localAnswer === option
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-400"
                }`}
              >
                {localAnswer === option && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      );
    } else if (currentQuestion.type === "multiple-select") {
      return (
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                localSelectedOptions.includes(option)
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 bg-gray-900/30 hover:border-gray-500"
              } ${isSubmitted ? "cursor-not-allowed opacity-75" : ""}`}
            >
              <input
                type="checkbox"
                value={option}
                checked={localSelectedOptions.includes(option)}
                onChange={() => handleMultipleSelectChange(option)}
                disabled={isSubmitted}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  localSelectedOptions.includes(option)
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-400"
                }`}
              >
                {localSelectedOptions.includes(option) && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      );
    }
  };

  const renderSubmittedState = () => {
    const answer = answers[questionKey];
    if (!isSubmitted || !answer) return null;

    return (
      <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Answer submitted</span>
        </div>
        <div className="text-green-200 text-sm mt-1">
          <span className="font-medium">Your answer: </span>
          {Array.isArray(answer) ? (
            <div className="mt-1">
              {answer.map((item, index) => (
                <div key={index} className="ml-2">
                  • {item}
                </div>
              ))}
            </div>
          ) : (
            `"${answer}"`
          )}
        </div>
      </div>
    );
  };

  if (!isOpen || !currentQuestion) return null;

  const isAnswered = answers[questionKey];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gray-900/90 border-b border-gray-700/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-6 h-6 text-green-400" />
              <div>
                <h2 className="text-white font-semibold text-lg">Questions</h2>
                <p className="text-gray-400 text-sm">
                  {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-shrink-0 bg-gray-900/50 px-4 py-2">
          <div className="flex gap-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                  index === currentQuestionIndex
                    ? "bg-blue-500"
                    : index < currentQuestionIndex
                    ? "bg-green-500"
                    : answers[`${taskId}-${questions[index].id}`]
                    ? "bg-green-500/50"
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Terminal Header */}
        <div className="flex-shrink-0 bg-gray-900/80 px-4 py-3 border-b border-gray-700/30">
          <div className="font-mono text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-gray-500">┌──(</span>
              <span className="text-blue-400">student@kali</span>
              <span className="text-gray-500">)-[</span>
              <span className="text-yellow-400">~/{chapterPath}</span>
              <span className="text-gray-500">]</span>
            </div>
            <div className="flex items-center gap-2 text-green-400 mt-1">
              <span className="text-gray-500">└─</span>
              <span className="text-green-400">$</span>
              <span className="text-white ml-2">Connection: {ip}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Question */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {currentQuestionIndex + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-2">
                    {currentQuestion.text}
                  </h3>

                  {/* Question Type Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        currentQuestion.type === "text"
                          ? "bg-purple-900/30 text-purple-300 border border-purple-700/30"
                          : currentQuestion.type === "multiple-choice"
                          ? "bg-blue-900/30 text-blue-300 border border-blue-700/30"
                          : "bg-green-900/30 text-green-300 border border-green-700/30"
                      }`}
                    >
                      {currentQuestion.type === "text" && "Text Answer"}
                      {currentQuestion.type === "multiple-choice" &&
                        "Single Choice"}
                      {currentQuestion.type === "multiple-select" &&
                        "Multiple Choice"}
                    </span>
                  </div>

                  {/* Hint Toggle */}
                  {currentQuestion.hint && (
                    <button
                      onClick={toggleHint}
                      className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </button>
                  )}

                  {/* Hint Content */}
                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg"
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <p className="text-yellow-200 text-sm">
                            {currentQuestion.hint}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Answer Input */}
              <div className="space-y-3">
                {renderAnswerInput()}

                {/* Submit Button */}
                {!isSubmitted && (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!canSubmit()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Answer
                  </button>
                )}

                {/* Submitted State */}
                {renderSubmittedState()}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Footer */}
        <div className="flex-shrink-0 bg-gray-900/90 border-t border-gray-700/50 px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full border-2 transition-colors ${
                    index === currentQuestionIndex
                      ? "border-blue-500 bg-blue-500 text-white"
                      : answers[`${taskId}-${questions[index].id}`]
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {answers[`${taskId}-${questions[index].id}`] ? (
                    <CheckCircle className="w-4 h-4 mx-auto" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={isLastQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FullscreenAnswerPage;
