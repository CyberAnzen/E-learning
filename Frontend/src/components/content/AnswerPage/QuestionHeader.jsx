import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { X, Terminal, HelpCircle, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../layout/Logo";

const QuestionHeader = ({
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
  onClose,
}) => {
  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-md  px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-60 flex justify-center">
            <Logo />
          </div>

          <div>
            <h2 className="text-cyan-300 font-bold text-lg sm:text-2xl drop-shadow-lg">
              Final ASSESSMENT
            </h2>
            <p className="text-gray-300 text-sm sm:text-base flex items-center gap-2 flex-wrap">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-green-400 font-bold flex items-center gap-1">
                <HelpCircle className="w-4 h-4" />
                {answeredCount} COMPLETED
              </span>
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="p-3 text-gray-400 hover:text-cyan-300 hover:bg-black/60 rounded-2xl transition-all duration-300 backdrop-blur-sm border-2 border-cyan-400/30 shadow-lg shadow-cyan-400/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <X className="w-6 h-6 relative z-10" />
        </motion.button>
      </div>
    </div>
  );
};

QuestionHeader.propTypes = {
  currentQuestionIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  answeredCount: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default QuestionHeader;
