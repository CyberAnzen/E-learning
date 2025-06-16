import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Lightbulb, AlertCircle } from 'lucide-react';

const QuestionDisplay = ({ 
  question, 
  currentQuestionIndex, 
  currentAnswerState 
}) => {
  const [showHint, setShowHint] = useState(false);

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  return (
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
            {question.text}
          </h3>

          <div className="mb-4">
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                question.type === "text"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : question.type === "multiple-choice"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-green-500/20 text-green-300 border border-green-500/30"
              }`}
            >
              {question.type === "text" && "Free Text Response"}
              {question.type === "multiple-choice" && "Single Selection • Auto-submit"}
              {question.type === "multiple-select" && "Multiple Selection"}
            </span>
          </div>

          {question.hint && (
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
                    {question.hint}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

QuestionDisplay.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'multiple-choice', 'multiple-select']).isRequired,
    hint: PropTypes.string,
    options: PropTypes.array,
  }).isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  currentAnswerState: PropTypes.object,
};

export default QuestionDisplay;