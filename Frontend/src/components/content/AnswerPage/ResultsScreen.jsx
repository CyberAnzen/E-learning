import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  X,
  RotateCcw,
} from 'lucide-react';

const ResultsScreen = ({ assessmentResult, questions, onReset, onClose }) => {
  if (!assessmentResult) return null;

  const timeMinutes = Math.floor(assessmentResult.timeSpent / 60000);
  const timeSeconds = Math.floor((assessmentResult.timeSpent % 60000) / 1000);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/25"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-white"
        >
          Assessment Complete!
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-8 text-gray-300"
        >
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span>
              {assessmentResult.score}/{assessmentResult.totalQuestions} Correct
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>{assessmentResult.percentage}% Score</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span>
              {timeMinutes}m {timeSeconds}s
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {assessmentResult.score}
            </div>
            <div className="text-gray-400">Correct Answers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {assessmentResult.percentage}%
            </div>
            <div className="text-gray-400">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {timeMinutes}:{timeSeconds.toString().padStart(2, "0")}
            </div>
            <div className="text-gray-400">Time Taken</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          Question Breakdown
        </h3>

        <div className="space-y-4">
          {questions.map((question, index) => {
            const result = assessmentResult.results[question.id];
            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`p-4 rounded-xl border backdrop-blur-sm ${
                  result?.isCorrect
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      result?.isCorrect
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {result?.isCorrect ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium mb-2">
                      Question {index + 1}: {question.text}
                    </div>
                    {result?.explanation && (
                      <div
                        className={`text-sm ${
                          result.isCorrect ? "text-green-200" : "text-red-200"
                        }`}
                      >
                        {result.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/10"
        >
          <X className="w-4 h-4" />
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

ResultsScreen.propTypes = {
  assessmentResult: PropTypes.object,
  questions: PropTypes.array.isRequired,
  onReset: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResultsScreen;