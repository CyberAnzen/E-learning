import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Home } from "lucide-react";
import { AppContext } from "../context/AppContext";
const Unauthorized = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(6);
  const { logout } = useContext(AppContext);

  useEffect(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleLogin = () => navigate("/login");
  const handleHome = () => navigate("/");

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const glitchAnimation = {
    initial: { x: 0 },
    animate: { x: [-2, 2, -2, 2, 0] },
    transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
  };
  const rotateAnimation = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: { duration: 2, repeat: Infinity, ease: "linear" },
    },
  };

  return (
    <div className="min-h-[90vh]  flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-2xl w-full text-center"
      >
        {/* 401 Text */}
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.h1
            variants={glitchAnimation}
            initial={glitchAnimation.initial}
            animate={glitchAnimation.animate}
            transition={glitchAnimation.transition}
            className="md:text-8xl text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"
          >
            401
          </motion.h1>
          <motion.p
            className="text-2xl text-gray-400 mb-2"
            variants={itemVariants}
          >
            Access Denied: Authorization Required
          </motion.p>
          <motion.p className="text-gray-500" variants={itemVariants}>
            You need valid credentials to access this resource.
          </motion.p>
        </motion.div>

        {/* Animated Border Box */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 text-gray-400">
            <motion.div
              animate={{ borderColor: ["#ef4444", "#f97316", "#ef4444"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 rounded-full border-2"
            />
            <code className="font-mono text-sm">
              Error: Unauthorized access detected
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
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white font-medium rounded-lg transition-all duration-300 text-base sm:text-lg lg:text-xl"
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            Return Home
          </Link>
          <button
            onClick={() => handleLogin()}
            className="cyber-button inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#01ffdb]/10 border border-[#01ffdb]/50 text-[#01ffdb] font-medium rounded-lg hover:bg-[#01ffdb]/20 transition-all duration-300 text-base sm:text-lg lg:text-xl"
          >
            <LogIn className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            Login
          </button>
        </motion.div>

        {/* Scanning Line Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            animate={{ y: ["-100%", "100vh"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
