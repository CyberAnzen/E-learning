import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = ({ isVisible, title, message }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center"
      >
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-black/70 to-gray-900/70 backdrop-blur-md rounded-3xl p-12 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-400/20 text-center relative overflow-hidden max-w-md mx-4"
        >
          {/* Cyber accent line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300"></div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6 shadow-lg shadow-cyan-400/30"
          />

          <h3 className="text-cyan-300 text-2xl font-bold mb-4 drop-shadow-lg">
            {title}
          </h3>
          <p className="text-gray-300 text-lg">{message}</p>

          {/* Loading dots animation */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-cyan-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

LoadingScreen.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default LoadingScreen;
