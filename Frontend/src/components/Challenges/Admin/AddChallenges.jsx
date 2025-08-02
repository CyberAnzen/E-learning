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
          flex flex-col
          min-h-[200px] sm:min-h-[250px] md:min-h-[300px]
          bg-green-900/10
          backdrop-blur-xl
          p-6
          rounded-xl
          border border-green-700/50
          hover:border-green-400/40
          transition-all duration-300 ease-out
          hover:shadow-lg hover:shadow-green-500/20
        "
      >
        <section
          className="
            absolute
            inset-0
            bg-green-950/60
            opacity-60
            backdrop-blur-2xl
            border-0.5
            border-green-700/40
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
            <div className="p-3 bg-green-800/50 rounded-lg">
              <Code className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-green-300/80">Difficulty</span>
              <span className="text-lg font-semibold text-white">NA%</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2 truncate">
            Add Challenge Title
          </h2>
          <p className="text-green-300/80 mb-4 line-clamp-3">
            Add The Description of the new Challenge
          </p>

          <div className="mt-auto">
            <div className="flex justify-end text-sm">
              <span className="text-green-400">Security</span>
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
            ${hover ? "bg-green-600/20" : "bg-transparent"}
          `}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`
              ${!hover ? "bg-green-600/50" : "bg-green-600/70"}
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