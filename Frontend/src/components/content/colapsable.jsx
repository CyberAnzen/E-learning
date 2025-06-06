import React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CollapsibleSection = ({
  title,
  icon,
  children,
  isOpen,
  onToggle,
  // onFullScreen prop is no longer needed
}) => {
  return (
    <div className="border border-gray-700/50 rounded-lg overflow-hidden mb-4 transition-all duration-300">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="cyber-button w-full px-4 py-3 bg-transparent border border-[#01ffdb]/20
                  font-medium rounded-lg hover:bg-transparent
                  transition-all  font-mono relative overflow-hidden text-xltransition-colors duration-200 text-white flex items-center gap-3"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-white font-medium">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-800/30">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection;
