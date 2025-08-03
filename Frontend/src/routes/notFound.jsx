import React from "react";
import { motion } from "framer-motion";
import { Shield, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const glitchAnimation = {
    initial: { x: 0 },
    animate: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  const rotateAnimation = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-2xl w-full"
      >
        {/* Shield Icon
        <motion.div
          className="flex justify-center mb-8"
          variants={itemVariants}
        >
          <Shield className="w-24 h-24 text-blue-400" />
        </motion.div> */}

        {/* 404 Text */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.h1
            variants={glitchAnimation}
            animate="animate"
            className="md:text-8xl text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500"
          >
            404
          </motion.h1>
          <motion.p
            className="text-2xl text-gray-400 mb-2"
            variants={itemVariants}
          >
            Access Denied: Target Not Found
          </motion.p>
          <motion.p className="text-gray-500" variants={itemVariants}>
            The requested resource has been moved or no longer exists in our
            system.
          </motion.p>
        </motion.div>

        {/* Animated Border Box */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 text-gray-400">
            <motion.div
              animate={{
                borderColor: ["#60A5FA", "#A78BFA", "#60A5FA"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-2 h-2 rounded-full border-2"
            />
            <code className="font-mono text-sm">
              Error: Path '/[requested_path]' not found in system
            </code>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 cyber-button  bg-[#01ffdb]/10 border border-[#01ffdb]/50 text-[#01ffdb] font-medium rounded-lg hover:bg-[#01ffdb]/20  transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white font-medium rounded-lg transition-all duration-300"
          >
            <motion.div variants={rotateAnimation} animate="animate">
              <RefreshCw className="w-5 h-5" />
            </motion.div>
            Go Back
          </button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full" />
        </motion.div>
      </motion.div>{" "}
      {/* Blocking Overlay (Coming Soon...) */}
      {/* Static "Coming Soon..." text */}
      {/* <motion.div
        className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-white">Coming Soon...</h1>
      </motion.div> */}
    </div>
  );
};

export default NotFound;
