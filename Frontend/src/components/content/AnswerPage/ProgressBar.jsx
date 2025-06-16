import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ProgressBar = ({ questions, currentQuestionIndex, answers }) => {
  return (
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
  );
};

ProgressBar.propTypes = {
  questions: PropTypes.array.isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  answers: PropTypes.object.isRequired,
};

export default ProgressBar;