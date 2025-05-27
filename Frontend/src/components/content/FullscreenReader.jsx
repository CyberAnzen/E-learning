import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const FullScreenReader = ({ section, content, title, icon, onClose }) => {
  // Handle escape key press to close
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // Track mobile back event (browser back / swipe gesture)
  useEffect(() => {
    // Push a custom history state so back will trigger popstate
    window.history.pushState({ fullscreenReader: true }, "");
    const handlePopState = (e) => {
      if (e.state && e.state.fullscreenReader) onClose();
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      // Clean up this state so history is back to original
      if (window.history.state && window.history.state.fullscreenReader) {
        window.history.back();
      }
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-gray-800 to-gray-700 backdrop-blur-lg flex flex-col"
    >
      <div className="p-4 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex-1 w-full overflow-y-auto p-6 md:p-10 custom-scrollbar bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100"
      >
        {content}
      </motion.div>

      <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default FullScreenReader;