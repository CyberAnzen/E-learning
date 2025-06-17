import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Send, CheckCircle, X } from "lucide-react";

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
            className={`w-full p-4 bg-black/40 backdrop-blur-md border rounded-2xl text-cyan-100 placeholder-gray-400 resize-none focus:outline-none transition-all duration-300 shadow-lg ${
              isLocked
                ? "border-gray-500/50 cursor-not-allowed opacity-75"
                : "border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/70 shadow-cyan-400/20"
            }`}
            rows={4}
            disabled={isLocked}
          />
          {isValidating && (
            <div className="absolute top-4 right-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"
              />
            </div>
          )}
        </div>
        {!isLocked && (
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTextSubmit}
            disabled={!localAnswer.trim()}
            className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-cyan-400/30 backdrop-blur-sm border-2 border-cyan-300/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <Send className="w-5 h-5 relative z-10" />
            <span className="relative z-10">SUBMIT ANSWER</span>
          </motion.button>
        )}
      </div>
    );
  } else if (question.type === "multiple-choice") {
    return (
      <div className="space-y-4">
        {question.options?.map((option, index) => {
          const isSelected = localAnswer === option;
          const isCorrectOption = validation?.correctAnswer === option;
          const isIncorrectSelection =
            isLocked && isSelected && !validation?.isCorrect;

          return (
            <motion.label
              key={index}
              whileHover={!isLocked ? { scale: 1.01, x: 4 } : {}}
              whileTap={!isLocked ? { scale: 0.99 } : {}}
              className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-md relative overflow-hidden ${
                isLocked
                  ? isCorrectOption
                    ? "border-green-400/50 bg-gradient-to-r from-green-500/10 to-emerald-600/10 shadow-green-400/20"
                    : isIncorrectSelection
                    ? "border-red-400/50 bg-gradient-to-r from-red-500/10 to-pink-600/10 shadow-red-400/20"
                    : "border-gray-500/30 bg-black/20 opacity-60"
                  : isSelected
                  ? "border-cyan-400/70 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 shadow-cyan-400/30"
                  : "border-cyan-400/30 bg-black/40 hover:border-cyan-400/50 hover:bg-black/60 shadow-cyan-400/10"
              } ${isLocked ? "cursor-not-allowed" : ""} shadow-2xl`}
            >
              {/* Cyber accent line */}
              <div
                className={`absolute top-0 left-0 w-full h-1 ${
                  isLocked
                    ? isCorrectOption
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : isIncorrectSelection
                      ? "bg-gradient-to-r from-red-400 to-pink-500"
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                    : isSelected
                    ? "bg-gradient-to-r from-cyan-400 to-teal-500"
                    : "bg-gradient-to-r from-cyan-400/30 to-teal-500/30"
                }`}
              ></div>

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
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isLocked
                    ? isCorrectOption
                      ? "border-green-400 bg-green-400 shadow-green-400/30"
                      : isIncorrectSelection
                      ? "border-red-400 bg-red-400 shadow-red-400/30"
                      : "border-gray-400 bg-gray-600"
                    : isSelected
                    ? "border-cyan-400 bg-cyan-400 shadow-cyan-400/30"
                    : "border-cyan-400/50 bg-black/40"
                }`}
              >
                {((isLocked && isCorrectOption) ||
                  (!isLocked && isSelected)) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 rounded-full bg-black"
                  />
                )}
                {isLocked && isIncorrectSelection && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 rounded-full bg-black"
                  />
                )}
              </div>
              <span
                className={`flex-1 text-lg font-medium ${
                  isLocked
                    ? isCorrectOption
                      ? "text-green-300 font-bold"
                      : isIncorrectSelection
                      ? "text-red-300"
                      : "text-gray-400"
                    : "text-cyan-100"
                }`}
              >
                {option}
              </span>
              {isLocked && isCorrectOption && (
                <CheckCircle className="w-6 h-6 text-green-400" />
              )}
              {isLocked && isIncorrectSelection && (
                <X className="w-6 h-6 text-red-400" />
              )}
            </motion.label>
          );
        })}
        {isValidating && (
          <div className="flex items-center justify-center py-6 bg-black/40 rounded-2xl backdrop-blur-md border-2 border-cyan-400/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full"
            />
            <span className="ml-3 text-cyan-300 font-bold">
              VALIDATING ANSWER...
            </span>
          </div>
        )}
      </div>
    );
  } else if (question.type === "multiple-select") {
    return (
      <div className="space-y-4">
        <div className="space-y-4">
          {question.options?.map((option, index) => {
            const isSelected = localSelectedOptions.includes(option);
            const correctAnswers = validation?.correctAnswer || [];
            const isCorrectOption = correctAnswers.includes(option);
            const isIncorrectSelection =
              isLocked && isSelected && !isCorrectOption;

            return (
              <motion.label
                key={index}
                whileHover={!isLocked ? { scale: 1.01, x: 4 } : {}}
                whileTap={!isLocked ? { scale: 0.99 } : {}}
                className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-md relative overflow-hidden ${
                  isLocked
                    ? isCorrectOption
                      ? "border-green-400/50 bg-gradient-to-r from-green-500/10 to-emerald-600/10 shadow-green-400/20"
                      : isIncorrectSelection
                      ? "border-red-400/50 bg-gradient-to-r from-red-500/10 to-pink-600/10 shadow-red-400/20"
                      : "border-gray-500/30 bg-black/20 opacity-60"
                    : isSelected
                    ? "border-green-400/70 bg-gradient-to-r from-green-500/10 to-emerald-500/10 shadow-green-400/30"
                    : "border-cyan-400/30 bg-black/40 hover:border-cyan-400/50 hover:bg-black/60 shadow-cyan-400/10"
                } ${isLocked ? "cursor-not-allowed" : ""} shadow-2xl`}
              >
                {/* Cyber accent line */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${
                    isLocked
                      ? isCorrectOption
                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : isIncorrectSelection
                        ? "bg-gradient-to-r from-red-400 to-pink-500"
                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                      : isSelected
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : "bg-gradient-to-r from-cyan-400/30 to-teal-500/30"
                  }`}
                ></div>

                <input
                  type="checkbox"
                  value={option}
                  checked={isSelected}
                  onChange={() => onMultipleSelectChange(option)}
                  disabled={isLocked}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 shadow-lg ${
                    isLocked
                      ? isCorrectOption
                        ? "border-green-400 bg-green-400 shadow-green-400/30"
                        : isIncorrectSelection
                        ? "border-red-400 bg-red-400 shadow-red-400/30"
                        : "border-gray-400 bg-gray-600"
                      : isSelected
                      ? "border-green-400 bg-green-400 shadow-green-400/30"
                      : "border-cyan-400/50 bg-black/40"
                  }`}
                >
                  {((isLocked && isCorrectOption) ||
                    (!isLocked && isSelected)) && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                  {isLocked && isIncorrectSelection && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <X className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                </div>
                <span
                  className={`flex-1 text-lg font-medium ${
                    isLocked
                      ? isCorrectOption
                        ? "text-green-300 font-bold"
                        : isIncorrectSelection
                        ? "text-red-300"
                        : "text-gray-400"
                      : "text-cyan-100"
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
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onMultipleSelectSubmit}
            disabled={localSelectedOptions.length === 0}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-green-400/30 backdrop-blur-sm border-2 border-green-300/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <Send className="w-5 h-5 relative z-10" />
            <span className="relative z-10">SUBMIT SELECTION</span>
          </motion.button>
        )}
        {isValidating && (
          <div className="flex items-center justify-center py-6 bg-black/40 rounded-2xl backdrop-blur-md border-2 border-green-400/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full"
            />
            <span className="ml-3 text-green-300 font-bold">
              VALIDATING SELECTION...
            </span>
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
