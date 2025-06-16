import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Send, CheckCircle, X } from 'lucide-react';

const AnswerInput = ({
  question,
  localAnswer,
  setLocalAnswer,
  localSelectedOptions,
  setLocalSelectedOptions,
  currentAnswerState,
  onTextSubmit,
  onMultipleChoiceChange,
  onMultipleSelectChange,
  onMultipleSelectSubmit,
}) => {
  const isLocked = currentAnswerState?.isLocked;
  const isValidating = currentAnswerState?.isValidating;
  const validation = currentAnswerState?.validation;

  if (question.type === "text") {
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
            onClick={onTextSubmit}
            disabled={!localAnswer.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25"
          >
            <Send className="w-4 h-4" />
            Submit Answer
          </motion.button>
        )}
      </div>
    );
  } else if (question.type === "multiple-choice") {
    return (
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          const isSelected = localAnswer === option;
          const isCorrectOption = validation?.correctAnswer === option;
          const isIncorrectSelection = isLocked && isSelected && !validation?.isCorrect;

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
                name={`question-${question.id}`}
                value={option}
                checked={isSelected}
                onChange={() => onMultipleChoiceChange(option)}
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
                {((isLocked && isCorrectOption) || (!isLocked && isSelected)) && (
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
  } else if (question.type === "multiple-select") {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          {question.options?.map((option, index) => {
            const isSelected = localSelectedOptions.includes(option);
            const correctAnswers = validation?.correctAnswer || [];
            const isCorrectOption = correctAnswers.includes(option);
            const isIncorrectSelection = isLocked && isSelected && !isCorrectOption;

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
                  onChange={() => onMultipleSelectChange(option)}
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
                  {((isLocked && isCorrectOption) || (!isLocked && isSelected)) && (
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
            onClick={onMultipleSelectSubmit}
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
            <span className="ml-3 text-green-400">Validating selection...</span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

AnswerInput.propTypes = {
  question: PropTypes.object.isRequired,
  localAnswer: PropTypes.string.isRequired,
  setLocalAnswer: PropTypes.func.isRequired,
  localSelectedOptions: PropTypes.array.isRequired,
  setLocalSelectedOptions: PropTypes.func.isRequired,
  currentAnswerState: PropTypes.object,
  onTextSubmit: PropTypes.func.isRequired,
  onMultipleChoiceChange: PropTypes.func.isRequired,
  onMultipleSelectChange: PropTypes.func.isRequired,
  onMultipleSelectSubmit: PropTypes.func.isRequired,
};

export default AnswerInput;