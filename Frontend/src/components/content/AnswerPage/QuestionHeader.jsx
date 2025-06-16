import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { X, Terminal, HelpCircle } from 'lucide-react';

const QuestionHeader = ({ 
  currentQuestionIndex, 
  totalQuestions, 
  answeredCount, 
  onClose 
}) => {
  return (
    <div className="flex-shrink-0 bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-white/10">
            <Terminal className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-xl">
              Interactive Assessment
            </h2>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Question {currentQuestionIndex + 1} of {totalQuestions}
              <span className="text-green-400">
                • {answeredCount} completed
              </span>
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10"
        >
          <X className="w-6 h-6" />
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