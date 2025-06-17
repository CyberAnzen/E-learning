import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { X, Terminal, HelpCircle, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QuestionHeader = ({
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
  onClose,
}) => {
  const [showCyber, setShowCyber] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(
      () => setShowCyber((prev) => !prev),
      showCyber ? 9000 : 4000
    );
    return () => clearTimeout(timeout);
  }, [showCyber]);

  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-md border-b-2 border-cyan-400/30 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div
            className="cube-container"
            style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="wait">
              {showCyber ? (
                <motion.div
                  key="cyber"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Link to="/about">
                    <motion.div
                      className="flex items-center gap-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <div className="relative w-10 h-15 flex items-center">
                        <motion.img
                          src="/favicon.png"
                          alt="CyberAnzen Logo"
                          className="w-13 h-11 object-cover"
                          style={{ filter: "drop-shadow(0 0 8px #01ffdb)" }}
                          animate={{
                            scale: [1, 1.05, 1],
                            filter: [
                              "drop-shadow(0 0 8px #01ffdb)",
                              "drop-shadow(0 0 16px #01ffdb)",
                              "drop-shadow(0 0 8px #01ffdb)",
                            ],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                      </div>
                      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#16e8da] via-[#01fff7] to-[#01ffdb] tracking-tight hover:from-[#00c3ff] hover:to-[#01ffdb] transition-all duration-300">
                        CyberAnzen
                      </h1>
                    </motion.div>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="srmist"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Link to="/about">
                    <div className="relative w-30 h-15 overflow-hidden">
                      <img
                        src="https://lirp.cdn-website.com/5db65efd/dms3rep/multi/opt/Mask-group--282-29-1920w.png"
                        alt="SRMIST Trichy"
                        className="w-full h-14 object-cover transform transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                      />
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

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
