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
} from "lucide-react";

const QuestionInterface = ({
  isOpen,
  onClose,
  questions = [],
  answers,
  taskId,
  onAnswerSubmit,
  isSubmitted = false,
  ip = "192.168.1.100",
  chapterId = "ch1",
  chapterPath = "cybersec/basics",
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
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Track browser back button
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ fullscreenReader: true }, "");
      const handlePopState = () => onClose();
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [isOpen, onClose]);

  // Update local answer when switching questions
  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = answers[questionKey];

      if (
        currentQuestion.type === "text" ||
        currentQuestion.type === "multiple-choice"
      ) {
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
    } else {
      return;
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
            className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
            rows={4}
            disabled={isSubmitted}
          />
          {answers[questionKey] && (
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          )}
        </div>
      );
    } else if (currentQuestion.type === "multiple-choice") {
      return (
        <div className="space-y-3">
          {currentQuestion.options?.map((option, index) => (
            <motion.label
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                localAnswer === option
                  ? "border-blue-500/50 bg-blue-500/10 backdrop-blur-sm"
                  : "border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
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
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  localAnswer === option
                    ? "border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/25"
                    : "border-gray-400"
                }`}
              >
                {localAnswer === option && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-white"
                  />
                )}
              </div>
              <span className="text-white flex-1">{option}</span>
            </motion.label>
          ))}
        </div>
      );
    } else if (currentQuestion.type === "multiple-select") {
      return (
        <div className="space-y-3">
          {currentQuestion.options?.map((option, index) => (
            <motion.label
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                localSelectedOptions.includes(option)
                  ? "border-green-500/50 bg-green-500/10 backdrop-blur-sm"
                  : "border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
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
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                  localSelectedOptions.includes(option)
                    ? "border-green-500 bg-green-500 shadow-lg shadow-green-500/25"
                    : "border-gray-400"
                }`}
              >
                {localSelectedOptions.includes(option) && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </div>
              <span className="text-white flex-1">{option}</span>
            </motion.label>
          ))}
        </div>
      );
    }
  };

  const renderSubmittedState = () => {
    const answer = answers[questionKey];
    if (!isSubmitted || !answer) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-4"
      >
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Answer submitted</span>
        </div>
        <div className="text-green-200 text-sm mt-2">
          <span className="font-medium">Your answer: </span>
          {Array.isArray(answer) ? (
            <div className="mt-1 space-y-1">
              {answer.map((item, index) => (
                <div key={index} className="ml-2 flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-current" />
                  {item}
                </div>
              ))}
            </div>
          ) : (
            `"${answer}"`
          )}
        </div>
      </motion.div>
    );
  };

  if (!isOpen || !currentQuestion) return null;

  const isAnswered = answers[questionKey];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col"
      >
        {/* Header */}
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
                    • {answeredCount} answered
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

        {/* Progress Bar */}
        <div className="flex-shrink-0 bg-black/10 backdrop-blur-sm px-6 py-3">
          <div className="flex gap-2">
            {questions.map((_, index) => (
              <motion.div
                key={index}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  index === currentQuestionIndex
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
                    : index < currentQuestionIndex
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25"
                    : answers[`${taskId}-${questions[index].id}`]
                    ? "bg-gradient-to-r from-green-500/50 to-emerald-500/50"
                    : "bg-white/10"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </div>
        </div>

        {/* Terminal Header */}
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
                <Clock className="w-3 h-3 text-gray-400" />
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Question Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-sm">
                    {currentQuestionIndex + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-3 leading-relaxed">
                    {currentQuestion.text}
                  </h3>

                  {/* Question Type Badge */}
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
                        "Single Selection"}
                      {currentQuestion.type === "multiple-select" &&
                        "Multiple Selection"}
                    </span>
                  </div>

                  {/* Hint Toggle */}
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

                  {/* Hint Content */}
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

              {/* Answer Input */}
              <div className="space-y-4">
                {renderAnswerInput()}

                {/* Submit Button */}
                {!isSubmitted && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitAnswer}
                    disabled={!canSubmit()}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 backdrop-blur-sm"
                  >
                    <Send className="w-5 h-5" />
                    Submit Answer
                  </motion.button>
                )}

                {/* Submitted State */}
                {renderSubmittedState()}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Footer */}
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
              {questions.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${
                    index === currentQuestionIndex
                      ? "border-blue-500 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                      : answers[`${taskId}-${questions[index].id}`]
                      ? "border-green-500 bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                      : "border-white/20 bg-white/5 text-gray-400 hover:border-white/40 hover:bg-white/10"
                  }`}
                >
                  {answers[`${taskId}-${questions[index].id}`] ? (
                    <CheckCircle className="w-5 h-5 mx-auto" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </motion.button>
              ))}
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
