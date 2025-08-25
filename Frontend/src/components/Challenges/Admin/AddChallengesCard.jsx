import React, { useState } from "react";
import { Code, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AddCourse = () => {
  const [hover, setHover] = useState(false);

  return (
    <Link to="/challenge/add">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-gradient-to-br from-green-500/10 to-green-700/10 backdrop-blur-xl p-8 rounded-2xl border border-green-700/50 hover:border-green-500/50 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-green-500/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-2xl border border-green-400/20 rounded-2xl z-0" />

        <div
          className={`${
            hover ? "blur-sm" : "blur-none"
          } relative z-10 flex flex-col h-full space-y-6 transition-all duration-300`}
        >
          <div className="flex items-start justify-between">
            <div className="p-4 bg-gradient-to-br from-green-700/50 to-green-800/50 rounded-xl border border-green-600/30">
              <Code className="w-7 h-7 text-green-400" />
            </div>
            <div className="text-right space-y-1">
              <span className="text-sm text-green-300/80 font-medium">
                Difficulty
              </span>
              <span className="text-2xl font-bold text-white">NA%</span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white leading-tight">
              Add Challenge Title
            </h2>
            <p className="text-green-300/80 leading-relaxed">
              Add The Description of the new Challenge
            </p>
          </div>

          <div className="mt-auto flex justify-end text-sm">
            <span className="text-green-400 font-semibold">Security</span>
          </div>
        </div>

        <motion.button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out backdrop-blur-xl rounded-2xl z-20 cursor-pointer ${
            hover
              ? "bg-gradient-to-br from-green-500/20 to-green-700/20"
              : "bg-transparent"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            className={`${
              !hover
                ? "bg-gray-800/80"
                : "bg-gradient-to-br from-green-500/80 to-green-700/80"
            } p-6 backdrop-blur-md text-white rounded-2xl transform transition-all duration-300 shadow-lg ${
              hover ? "shadow-green-500/25" : "shadow-black/25"
            }`}
          >
            <Plus
              size={32}
              className={hover ? "text-white" : "text-green-400"}
            />
          </motion.div>
        </motion.button>
      </motion.div>
    </Link>
  );
};

export default AddCourse;
