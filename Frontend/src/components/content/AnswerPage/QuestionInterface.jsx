import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";

import { validateAnswer, submitAssessment } from "../utils/api";
import QuestionHeader from "./QuestionHeader";
import ProgressBar from "./ProgressBar";
// import TerminalInfo from "./TerminalInfo";
import QuestionDisplay from "./QuestionDisplay";
import AnswerInput from "./AnswerInput";
import ValidationFeedback from "./ValidationFeedback";
import NavigationControls from "./NavigationControls";
import LoadingScreen from "./LoadingScreen";
import ResultsScreen from "./ResultsScreen";

const QuestionInterface = ({
  isOpen = false,
  onClose = () => {},
  questions = [],
  lessonId = "",
  ip = "192.168.1.100",
  chapterId = "ch1",
  chapterPath = "cybersec/basics",
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [startTime] = useState(Date.now());
  const [localAnswer, setLocalAnswer] = useState("");
  const [localSelectedOptions, setLocalSelectedOptions] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswerState = answers[currentQuestion?.id];
  // Handle escape key and prevent body scroll
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

  // Handle browser back button
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ fullscreenReader: true }, "");
      const handlePopState = () => onClose();
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [isOpen, onClose]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setAnswers({});
      setAssessmentResult(null);
      setLocalAnswer("");
      setLocalSelectedOptions([]);
    }
  }, [isOpen]);

  // Update local state when question changes
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
    }
  }, [currentQuestionIndex, currentQuestion, answers]);

  // Auto-submit assessment when all questions are answered
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
      const validation = await validateAnswer(lessonId, questionId, answer);

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

      const result = await submitAssessment(
        lessonId,
        submissionAnswers,
        startTime
      );
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

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  const resetAssessment = () => {
    setAnswers({});
    setAssessmentResult(null);
    setCurrentQuestionIndex(0);
    setLocalAnswer("");
    setLocalSelectedOptions([]);
  };

  if (!isOpen || !currentQuestion) return null;

  const answeredCount = Object.keys(answers).filter(
    (id) => answers[id].validation && !answers[id].isValidating
  ).length;

  // Show results screen
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
            <ResultsScreen
              assessmentResult={assessmentResult}
              questions={questions}
              onReset={resetAssessment}
              onClose={onClose}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <LoadingScreen
        isVisible={isSubmittingAssessment}
        title="Processing Assessment"
        message="Calculating your results..."
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col"
      >
        <QuestionHeader
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          answeredCount={answeredCount}
          onClose={onClose}
        />

        <ProgressBar
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
        />

        {/* <TerminalInfo ip={ip} chapterPath={chapterPath} /> */}

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <QuestionDisplay
              question={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              currentAnswerState={currentAnswerState}
            />

            <div className="space-y-4">
              <AnswerInput
                question={currentQuestion}
                localAnswer={localAnswer}
                setLocalAnswer={setLocalAnswer}
                localSelectedOptions={localSelectedOptions}
                setLocalSelectedOptions={setLocalSelectedOptions}
                currentAnswerState={currentAnswerState}
                onTextSubmit={handleTextAnswerSubmit}
                onMultipleChoiceChange={handleMultipleChoiceChange}
                onMultipleSelectChange={handleMultipleSelectChange}
                onMultipleSelectSubmit={handleMultipleSelectSubmit}
              />

              <ValidationFeedback currentAnswerState={currentAnswerState} />
            </div>
          </motion.div>
        </div>

        <NavigationControls
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onQuestionSelect={handleQuestionSelect}
        />
      </motion.div>
    </AnimatePresence>
  );
};

QuestionInterface.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  questions: PropTypes.array,
  lessonId: PropTypes.string,
  ip: PropTypes.string,
  chapterId: PropTypes.string,
  chapterPath: PropTypes.string,
};

export default React.memo(QuestionInterface);
