import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { CheckCircle, X, AlertTriangle } from "lucide-react";

const ValidationFeedback = ({ currentAnswerState }) => {
  const validation = currentAnswerState?.validation;

  if (!validation || currentAnswerState?.isValidating) {
    return null;
  }
  // console.log(currentAnswerState.validation.correctAnswer);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`p-6 rounded-2xl backdrop-blur-md border-2 shadow-2xl relative overflow-hidden ${
        validation.isCorrect
          ? "bg-gradient-to-r from-green-500/10 to-emerald-600/10 border-green-400/50 shadow-green-400/20"
          : "bg-gradient-to-r from-red-500/10 to-pink-600/10 border-red-400/50 shadow-red-400/20"
      }`}
    >
      {/* Cyber accent line */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          validation.isCorrect
            ? "bg-gradient-to-r from-green-400 to-emerald-500"
            : "bg-gradient-to-r from-red-400 to-pink-500"
        }`}
      ></div>

      <div
        className={`flex items-center gap-3 mb-3 ${
          validation.isCorrect ? "text-green-300" : "text-white"
        }`}
      >
        <div
          className={`p-2 rounded-xl ${
            validation.isCorrect
              ? "bg-green-400/20 border border-green-400/30"
              : "bg-red-400/20 border border-red-400/30"
          }`}
        >
          {validation.isCorrect ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </div>
        <span className="font-bold text-lg">
          {validation.isCorrect ? " CORRECT ANSWER!" : " INCORRECT ANSWER"}
          {!validation.isCorrect && (
            <div className="text-red-200 pt-2">
              correct Answer: {currentAnswerState.validation.correctAnswer}
            </div>
          )}
        </span>
      </div>

      {validation.explanation && (
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl ${
              validation.isCorrect
                ? "bg-green-400/20 border border-green-400/30"
                : "hidden"
            }`}
          >
            {/* <AlertTriangle className="w-5 h-5 text-amber-400" /> */}
          </div>
          <div>
            <div className="text-cyan-300 font-bold text-base mb-2">
              Correct Answer: {currentAnswerState.validation.correctAnswer}
            </div>
            <p
              className={`text-base leading-relaxed ${
                validation.isCorrect ? "text-green-200" : "text-red-200"
              }`}
            >
              {validation.explanation}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

ValidationFeedback.propTypes = {
  currentAnswerState: PropTypes.object,
};

export default ValidationFeedback;
