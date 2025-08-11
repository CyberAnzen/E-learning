import  {  useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const glitchAnimation = {
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
    animate: {
      rotate: 360,
      transition: { duration: 2, repeat: Infinity, ease: "linear" },
    },
  };

  useEffect(() => {
    // Save original styles
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    // Lock scroll for all devices
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none"; // for mobile

    // Prevent touch scrolling on iOS/Android
    const preventScroll = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });

    // Scroll to bottom for all browsers
    const scrollToBottom = () => {
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );

      window.scrollTo({ top: height, behavior: "auto" });
      document.documentElement.scrollTop = height; // for Safari/iOS
    };

    // Run after layout paints
    requestAnimationFrame(scrollToBottom);

    return () => {
      // Restore original styles
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-2xl w-full"
      >
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
              animate={{ borderColor: ["#60A5FA", "#A78BFA", "#60A5FA"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 rounded-full border-2"
            />
            <code className="font-mono text-sm">
              Error: Path not found in system
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
            className="inline-flex items-center justify-center gap-2 px-6 py-3 cyber-button bg-[#01ffdb]/10 border border-[#01ffdb]/50 text-[#01ffdb] font-medium rounded-lg hover:bg-[#01ffdb]/20 transition-all duration-300"
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
      </motion.div>
    </div>
  );
};

export default NotFound;
