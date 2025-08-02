import React, { useState } from "react";
import { Code, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AddCourse = () => {
  const [hover, setHover] = useState(false);

  return (
    <Link to="/add-classification">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="
          group
          relative
          bg-blue-400/10
          backdrop-blur-xl
          p-6
          rounded-xl
          border border-gray-700
          hover:border-teal-500/50
          transition-all duration-300 ease-out
          hover:shadow-lg hover:shadow-cyan-500/10
        "
      >
        <section
          className="
            absolute
            inset-0
            bg-black/60
            opacity-60
            backdrop-blur-2xl
            border-0.5
            border-gray-400/40
            rounded-xl
            z-0
          "
        />

        <div
          className={`relative z-10 flex flex-col h-full ${
            hover ? "blur-sm" : "blur-xs"
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-700/50 rounded-lg">
              <Code className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-400">Difficulty</span>
              <span className="text-lg font-semibold text-white">NA%</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Add Challenge Title
          </h2>
          <p className="text-gray-400 ">
            Add The Description of the new Challenge
          </p>

          <div className="mt-auto">
            {/* <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `16%` }}
              />
            </div> */}
            <div className="flex justify-end text-sm">
              <span className="text-cyan-400">Security</span>
            </div>
          </div>
        </div>

        <motion.button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={`
            absolute inset-0
            flex items-center justify-center
            transition-all duration-300 ease-out
            backdrop-blur-3xl
            rounded-xl
            z-20
            cursor-pointer
            ${hover ? "bg-blue-400/10" : "bg-transparent"}
          `}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`
              ${!hover ? "bg-gray-400" : "bg-gray-400/60"}
              px-4 py-4
              backdrop-blur-md
              text-white
              rounded-lg
              transform group-hover:translate-y-0
            `}
          >
            <Plus size={30} />
          </motion.span>
        </motion.button>
      </motion.div>
    </Link>
  );
};

export default AddCourse;
