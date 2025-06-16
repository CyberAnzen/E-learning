import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const ValidationFeedback = ({ currentAnswerState }) => {
  const validation = currentAnswerState?.validation;
  
  if (!validation || currentAnswerState?.isValidating) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl backdrop-blur-sm border ${
        validation.isCorrect
          ? "bg-green-500/10 border-green-500/30"
          : "bg-red-500/10 border-red-500/30"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          validation.isCorrect ? "text-green-400" : "text-red-400"
        }`}
      >
        {validation.isCorrect ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <X className="w-5 h-5" />
        )}
        <span className="font-medium">
          {validation.isCorrect ? "Correct!" : "Incorrect"}
        </span>
      </div>
      {validation.explanation && (
        <p
          className={`text-sm mt-2 ${
            validation.isCorrect ? "text-green-200" : "text-red-200"
          }`}
        >
          {validation.explanation}
        </p>
      )}
    </motion.div>
  );
};

ValidationFeedback.propTypes = {
  currentAnswerState: PropTypes.object,
};

export default ValidationFeedback;