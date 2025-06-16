import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ isVisible, title, message }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-400">{message}</p>
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