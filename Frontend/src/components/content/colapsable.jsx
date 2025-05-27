import React from "react";
import { ChevronDown, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CollapsibleSection = ({
  title,
  icon,
  children,
  isOpen,
  onToggle,
  onFullScreen,
}) => {
  return (
    <div
      className={`border border-gray-700/50 rounded-lg overflow-hidden mb-4 transition-all duration-300 `}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFullScreen();
        }}
        className="w-full px-4 py-3 bg-gray-800/50 flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:bg-gray-700/70"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-white font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>
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
