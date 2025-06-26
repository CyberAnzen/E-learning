import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const QuestionTypeDropdown = ({ selectedType, onSelect, onFocus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const questionTypes = [
    { value: "text", label: "Text Answer" },
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "multiple-select", label: "Multiple Select" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type) => {
    onSelect(type.value);
    setIsOpen(false);
  };

  const selectedTypeData =
    questionTypes.find((type) => type.value === selectedType) ||
    questionTypes[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          onFocus && onFocus();
        }}
        className="w-full bg-gray-700/50 rounded-lg p-2 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono flex items-center justify-between hover:bg-cyan-300/20"
      >
        <span>{selectedTypeData.label}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl shadow-cyan-500/20"
          >
            <div className="p-1 space-y-1">
              {questionTypes.map((type, index) => (
                <motion.button
                  key={type.value}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelect(type)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all font-mono text-sm ${
                    selectedType === type.value
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-cyan-300"
                  }`}
                >
                  {type.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
