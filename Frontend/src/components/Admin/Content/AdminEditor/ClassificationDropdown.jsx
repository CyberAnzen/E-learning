import { motion, AnimatePresence } from "framer-motion";
import React, {
  useState,
  useEffect,
  useRef,

} from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
export const ClassificationDropdown = ({
  classifications,
  selectedId,
  onSelect,
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleSelect = (classification) => {
    onSelect(classification._id);
    setIsOpen(false);
  };

  const selectedClassification = classifications.find(
    (c) => c._id === selectedId
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          onFocus && onFocus();
        }}
        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10 flex items-center justify-between hover:bg-cyan-300/20"
      >
        <span>
          {selectedClassification
            ? selectedClassification.title
            : "Select a classification"}
        </span>
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
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl shadow-cyan-500/20 max-h-60 overflow-y-auto"
          >
            <div className="p-1 space-y-1">
              {classifications.map((classification, index) => (
                <motion.button
                  key={classification._id}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelect(classification)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all font-mono text-sm ${
                    selectedId === classification._id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-cyan-300"
                  }`}
                >
                  {classification.title}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
