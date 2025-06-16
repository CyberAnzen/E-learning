import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';

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
    <div className="flex-shrink-0 bg-black/20 backdrop-blur-md border-t border-white/10 px-6 py-4">
      <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevious}
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
                onClick={() => onQuestionSelect(index)}
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
          onClick={onNext}
          disabled={isLastQuestion}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-500 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed backdrop-blur-sm border border-white/10"
        >
          Next
          <ChevronRight className="w-4 h-4" />
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