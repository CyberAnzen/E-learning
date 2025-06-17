import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, X } from "lucide-react";

const NavigationControls = ({
  questions,
  currentQuestionIndex,
  answers,
  onPrevious,
  onNext,
  onQuestionSelect,
}) => {
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-md border-t-2 border-cyan-400/30 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-black/60 hover:bg-black/80 disabled:bg-black/30 disabled:text-gray-500 text-cyan-300 rounded-2xl font-bold transition-all duration-300 disabled:cursor-not-allowed backdrop-blur-sm border-2 border-cyan-400/30 shadow-lg shadow-cyan-400/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <ChevronLeft className="w-4 h-4 relative z-10" />
          <span className="relative z-10 hidden sm:inline">PREVIOUS</span>
        </motion.button>

        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-xs sm:max-w-none">
          {questions.map((_, index) => {
            const questionId = questions[index].id;
            const answerState = answers[questionId];
            const isAnswered = answerState?.validation;
            const isCorrect = answerState?.validation?.isCorrect;

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onQuestionSelect(index)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm font-bold relative overflow-hidden ${
                  index === currentQuestionIndex
                    ? "border-cyan-400 bg-gradient-to-br from-cyan-400 to-teal-500 text-black shadow-2xl shadow-cyan-400/30"
                    : isAnswered
                    ? isCorrect
                      ? "border-green-400 bg-gradient-to-br from-green-400 to-emerald-500 text-black shadow-2xl shadow-green-400/30"
                      : "border-red-400 bg-gradient-to-br from-red-400 to-pink-500 text-black shadow-2xl shadow-red-400/30"
                    : "border-cyan-400/30 bg-black/40 text-cyan-300 hover:border-cyan-400/50 hover:bg-black/60 shadow-lg shadow-cyan-400/10"
                }`}
              >
                {/* Cyber accent line */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${
                    index === currentQuestionIndex
                      ? "bg-gradient-to-r from-cyan-300 to-teal-400"
                      : isAnswered
                      ? isCorrect
                        ? "bg-gradient-to-r from-green-300 to-emerald-400"
                        : "bg-gradient-to-r from-red-300 to-pink-400"
                      : "bg-gradient-to-r from-cyan-400/30 to-teal-500/30"
                  }`}
                ></div>

                {isAnswered ? (
                  isCorrect ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
                  )
                ) : (
                  <span className="text-sm sm:text-base font-bold">
                    {index + 1}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          disabled={isLastQuestion}
          className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-black/60 hover:bg-black/80 disabled:bg-black/30 disabled:text-gray-500 text-cyan-300 rounded-2xl font-bold transition-all duration-300 disabled:cursor-not-allowed backdrop-blur-sm border-2 border-cyan-400/30 shadow-lg shadow-cyan-400/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 hidden sm:inline">NEXT</span>
          <ChevronRight className="w-4 h-4 relative z-10" />
        </motion.button>
      </div>
    </div>
  );
};

NavigationControls.propTypes = {
  questions: PropTypes.array.isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  answers: PropTypes.object.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onQuestionSelect: PropTypes.func.isRequired,
};

export default NavigationControls;
