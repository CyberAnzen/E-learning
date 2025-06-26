import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  X,
  RotateCcw,
  Book,
  Lightbulb,
  Zap,
  Shield,
} from "lucide-react";

const ResultsScreen = ({ assessmentResult, questions, onReset, onClose }) => {
  if (!assessmentResult) return null;

  // Convert time to readable format
  const totalSeconds = Math.floor(assessmentResult.timeSpent / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatTime = () => {
    if (hours > 0) {
      return `${hours} hours ${minutes} minutes ${seconds} seconds`;
    } else if (minutes > 0) {
      return `${minutes} minutes ${seconds} seconds`;
    } else {
      return `${seconds} seconds`;
    }
  };

  const formatTimeCompact = () => {
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  const getCorrectAnswer = (question) => {
    const result = assessmentResult.results[question.id];
    if (result && result.correctAnswer) {
      if (Array.isArray(result.correctAnswer)) {
        return result.correctAnswer.join(", ");
      }
      return result.correctAnswer;
    }
    return "N/A";
  };

  const getPerformanceMessage = () => {
    const percentage = assessmentResult.percentage;
    if (percentage >= 90)
      return { text: "Outstanding Performance! 🚀", color: "text-cyan-300" };
    if (percentage >= 80)
      return { text: "Excellent Work! ⚡", color: "text-cyan-400" };
    if (percentage >= 70)
      return { text: "Good Job! 💎", color: "text-cyan-500" };
    if (percentage >= 60)
      return { text: "Nice Try! 🔥", color: "text-cyan-600" };
    return { text: "Keep Learning! 🎯", color: "text-cyan-700" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 overflow-y-auto relative">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(1, 255, 219, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(1, 255, 219, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-300 rounded-full blur-3xl opacity-15 animate-pulse delay-1000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl mx-auto space-y-8 py-8 relative z-10"
      >
        {/* Header Section */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
            className="w-36 h-36 mx-auto bg-gradient-to-br from-cyan-400 via-cyan-300 to-teal-400 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-400/50 relative border-4 border-cyan-300/30"
          >
            <Trophy className="w-20 h-20 text-black" />
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black">
              <CheckCircle className="w-6 h-6 text-black" />
            </div>
            {/* Cyber rings */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping"></div>
            <div className="absolute inset-4 rounded-full border border-cyan-300/30 animate-pulse"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-300 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              ASSESSMENT COMPLETE
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <p
              className={`text-3xl font-bold ${performance.color} drop-shadow-lg`}
            >
              {performance.text}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8 text-gray-300 flex-wrap"
          >
            <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl backdrop-blur-sm border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
              <Target className="w-7 h-7 text-cyan-400" />
              <span className="font-bold text-lg text-cyan-300">
                {assessmentResult.score}/{assessmentResult.totalQuestions}{" "}
                Correct
              </span>
            </div>
            <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl backdrop-blur-sm border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
              <TrendingUp className="w-7 h-7 text-cyan-400" />
              <span className="font-bold text-lg text-cyan-300">
                {assessmentResult.percentage}% Score
              </span>
            </div>
            <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl backdrop-blur-sm border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
              <Clock className="w-7 h-7 text-cyan-400" />
              <span className="font-bold text-lg text-cyan-300">
                {formatTime()}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-md rounded-3xl p-8 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-400/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            <div className="text-center relative z-10">
              <div className="text-5xl font-bold text-cyan-300 mb-3 drop-shadow-lg">
                {assessmentResult.score}
              </div>
              <div className="text-cyan-400 font-bold text-lg">
                Correct Answers
              </div>
              <div className="text-gray-400 text-sm mt-2">Questions Solved</div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-400/20 rounded-full blur-xl"></div>
          </div>

          <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-md rounded-3xl p-8 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-400/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
            <div className="text-center relative z-10">
              <div className="text-5xl font-bold text-cyan-300 mb-3 drop-shadow-lg">
                {assessmentResult.percentage}%
              </div>
              <div className="text-cyan-400 font-bold text-lg">
                Overall Score
              </div>
              <div className="text-gray-400 text-sm mt-2">
                Performance Rating
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl"></div>
          </div>

          <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-md rounded-3xl p-8 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-400/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
            <div className="text-center relative z-10">
              <div className="text-5xl font-bold text-cyan-300 mb-3 drop-shadow-lg">
                {formatTimeCompact()}
              </div>
              <div className="text-cyan-400 font-bold text-lg">Time Taken</div>
              <div className="text-gray-400 text-sm mt-2">Duration</div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"></div>
          </div>
        </motion.div>

        {/* Question Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-br from-black/70 to-gray-900/70 backdrop-blur-md rounded-3xl p-10 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-400/20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300"></div>

          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl shadow-lg shadow-cyan-400/30">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-cyan-300 drop-shadow-lg">
                Question Analysis
              </h2>
              <p className="text-gray-400 text-lg">
                Detailed breakdown with correct answers
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {questions.map((question, index) => {
              const result = assessmentResult.results[question.id];
              const correctAnswer = getCorrectAnswer(question);
              const isCorrect = result?.isCorrect;

              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.15 }}
                  className={`relative p-8 rounded-3xl border-2 backdrop-blur-sm transition-all duration-300 overflow-hidden ${
                    isCorrect
                      ? "bg-gradient-to-r from-green-500/10 to-emerald-600/10 border-green-400/50 shadow-green-400/20"
                      : "bg-gradient-to-r from-red-500/10 to-pink-600/10 border-red-400/50 shadow-red-400/20"
                  } shadow-2xl`}
                >
                  {/* Cyber accent line */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 ${
                      isCorrect
                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : "bg-gradient-to-r from-red-400 to-pink-500"
                    }`}
                  ></div>

                  {/* Question Number Badge */}
                  <div
                    className={`absolute -top-4 -left-4 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-black shadow-2xl border-2 border-black ${
                      isCorrect
                        ? "bg-gradient-to-br from-green-400 to-emerald-500"
                        : "bg-gradient-to-br from-red-400 to-pink-500"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Status Icon */}
                  <div
                    className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-black ${
                      isCorrect
                        ? "bg-gradient-to-br from-green-400 to-emerald-500"
                        : "bg-gradient-to-br from-red-400 to-pink-500"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-black" />
                    ) : (
                      <X className="w-6 h-6 text-black" />
                    )}
                  </div>

                  <div className="pr-20">
                    {/* Question Text */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-cyan-300 mb-3 drop-shadow-lg">
                        Question {index + 1}: {question.text}
                      </h3>
                    </div>

                    {/* Correct Answer Section */}
                    <div className="bg-black/40 rounded-2xl p-6 mb-6 border-2 border-cyan-400/30 shadow-lg shadow-cyan-400/10">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl shadow-lg shadow-cyan-400/30">
                          <Lightbulb className="w-6 h-6 text-black" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-cyan-300 font-bold text-lg">
                              Correct Answer:
                            </span>
                            <Zap className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div className="text-cyan-100 font-bold bg-gradient-to-r from-cyan-500/20 to-teal-500/20 p-4 rounded-xl border-2 border-cyan-400/30 shadow-inner text-lg">
                            {correctAnswer}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Result Status */}
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 font-bold text-lg">
                        Your Result:
                      </span>
                      <span
                        className={`px-4 py-2 rounded-xl text-lg font-bold border-2 ${
                          isCorrect
                            ? "bg-green-500/20 text-green-300 border-green-400/50 shadow-green-400/20"
                            : "bg-red-500/20 text-red-300 border-red-400/50 shadow-red-400/20"
                        } shadow-lg`}
                      >
                        {isCorrect ? "✓ CORRECT" : "✗ INCORRECT"}
                      </span>
                    </div>

                    {/* Explanation if available */}
                    {result?.explanation && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border-2 border-indigo-400/30">
                        <div className="flex items-start gap-3">
                          <Book className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                          <div>
                            <span className="text-indigo-300 font-bold">
                              Explanation:
                            </span>
                            <div className="text-indigo-200 mt-2 text-lg">
                              {result.explanation}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-black rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-cyan-400/30 backdrop-blur-sm border-2 border-cyan-300/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <RotateCcw className="w-6 h-6 relative z-10" />
            <span className="relative z-10">TRY AGAIN</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex items-center gap-4 px-10 py-5 bg-black/60 hover:bg-black/80 text-cyan-300 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-sm border-2 border-cyan-400/50 shadow-2xl shadow-cyan-400/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <X className="w-6 h-6 relative z-10" />
            <span className="relative z-10">CLOSE</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResultsScreen;
