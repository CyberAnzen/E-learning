import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const ProgressBar = ({ questions, currentQuestionIndex, answers }) => {
  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-black/20 to-gray-900/20 backdrop-blur-sm px-4 sm:px-6 py-4 border-b border-cyan-400/20">
      <div className="flex gap-1 sm:gap-2 max-w-6xl mx-auto">
        {questions.map((_, index) => {
          const questionId = questions[index].id;
          const isAnswered = answers[questionId]?.validation;
          const isCorrect = answers[questionId]?.validation?.isCorrect;

          return (
            <motion.div
              key={index}
              className={`flex-1 h-2 sm:h-3 rounded-full transition-all duration-500 relative overflow-hidden ${
                index === currentQuestionIndex
                  ? "bg-gradient-to-r from-cyan-400 to-teal-500 shadow-lg shadow-cyan-400/30"
                  : isAnswered
                  ? isCorrect
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/30"
                    : "bg-gradient-to-r from-red-400 to-pink-500 shadow-lg shadow-red-400/30"
                  : "bg-black/40 border border-cyan-400/20"
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Cyber glow effect */}
              {(index === currentQuestionIndex || isAnswered) && (
                <div
                  className={`absolute inset-0 ${
                    index === currentQuestionIndex
                      ? "bg-gradient-to-r from-cyan-300/50 to-teal-400/50"
                      : isCorrect
                      ? "bg-gradient-to-r from-green-300/50 to-emerald-400/50"
                      : "bg-gradient-to-r from-red-300/50 to-pink-400/50"
                  } animate-pulse`}
                ></div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  questions: PropTypes.array.isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  answers: PropTypes.object.isRequired,
};

export default ProgressBar;
