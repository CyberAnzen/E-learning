import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Lightbulb, AlertCircle, Zap } from "lucide-react";

const QuestionDisplay = ({
  question,
  currentQuestionIndex,
  currentAnswerState,
}) => {
  const [showHint, setShowHint] = useState(false);

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  return (
    <div className="bg-gradient-to-br from-black/70 to-gray-900/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-400/20 relative overflow-hidden">
      {/* Cyber accent line */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300"></div>

      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl border-2 border-black relative overflow-hidden ${
            currentAnswerState?.validation
              ? currentAnswerState.validation.isCorrect
                ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-400/30"
                : "bg-gradient-to-br from-red-400 to-pink-500 shadow-red-400/30"
              : "bg-gradient-to-br from-cyan-400 to-teal-500 shadow-cyan-400/30"
          }`}
        >
          {/* Cyber rings */}
          <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-pulse"></div>

          {currentAnswerState?.validation ? (
            currentAnswerState.validation.isCorrect ? (
              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-black relative z-10" />
            ) : (
              <X className="w-6 h-6 sm:w-7 sm:h-7 text-black relative z-10" />
            )
          ) : (
            <span className="text-black font-bold text-lg sm:text-xl relative z-10">
              {currentQuestionIndex + 1}
            </span>
          )}
        </div>

        <div className="flex-1 w-full">
          <h3 className="text-cyan-300 font-bold text-xl sm:text-2xl mb-4 leading-relaxed drop-shadow-lg">
            {question.text}
          </h3>

          {/* <div className="mb-6">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold backdrop-blur-sm border-2 shadow-lg ${
                question.type === "text"
                  ? "bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-purple-400/20"
                  : question.type === "multiple-choice"
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-cyan-400/20"
                  : "bg-green-500/20 text-green-300 border-green-400/50 shadow-green-400/20"
              }`}
            >
              <Zap className="w-4 h-4 mr-2" />
              {question.type === "text" && "FREE TEXT RESPONSE"}
              {question.type === "multiple-choice" &&
                "SINGLE SELECTION • AUTO-SUBMIT"}
              {question.type === "multiple-select" && "MULTIPLE SELECTION"}
            </span>
          </div> */}

          {question.hint && (
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleHint}
              className="flex items-center gap-3 text-amber-300 hover:text-amber-200 text-sm font-bold transition-all duration-300 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm px-4 py-3 rounded-2xl border-2 border-amber-400/50 shadow-lg shadow-amber-400/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <Lightbulb className="w-5 h-5 relative z-10" />
              <span className="relative z-10">
                {showHint ? "HIDE HINT" : "NEED A HINT?"}
              </span>
            </motion.button>
          )}

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 backdrop-blur-sm border-2 border-amber-400/30 rounded-2xl shadow-lg shadow-amber-400/20 relative overflow-hidden"
              >
                {/* Cyber accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-yellow-500"></div>

                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-amber-300 font-bold text-lg mb-2">
                      HINT:
                    </div>
                    <p className="text-amber-200 text-base leading-relaxed">
                      {question.hint}
                    </p>
                  </div>
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
    type: PropTypes.oneOf(["text", "multiple-choice", "multiple-select"])
      .isRequired,
    hint: PropTypes.string,
    options: PropTypes.array,
  }).isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  currentAnswerState: PropTypes.object,
};

export default QuestionDisplay;
