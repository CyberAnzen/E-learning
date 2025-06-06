import React, { useEffect, useState } from "react";
import { X, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const FullScreenReader = ({ section, content, title, icon, onClose }) => {
  // Local theme state: 'dark' or 'light'
  const [theme, setTheme] = useState("dark");

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
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Track browser back button: close modal instead of navigating away
  useEffect(() => {
    window.history.pushState({ fullscreenReader: true }, "");
    const handlePopState = (e) => {
      if (e.state && e.state.fullscreenReader) {
        onClose();
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      // No history.back() here, so clicking back just closes the modal
    };
  }, [onClose]);

  // Toggle between 'dark' and 'light' themes
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Framer Motion variants for the content area
  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.1, duration: 0.3 },
    },
  };

  // Determine classes based on current theme
  const rootClasses =
    theme === "dark"
      ? "fixed inset-0 z-50 bg-gradient-to-b from-gray-800 to-gray-700 backdrop-blur-lg flex flex-col"
      : "fixed inset-0 z-50 bg-white flex flex-col";

  const headerClasses =
    theme === "dark"
      ? "p-4 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700"
      : "p-4 flex items-center justify-between bg-gray-50 border-b border-gray-200";

  const titleClasses =
    theme === "dark"
      ? "text-xl font-bold text-white"
      : "text-xl font-bold text-gray-900";

  // ✏️ Here is the only change: we add [&_*]:text-gray-100 (or [&_*]:text-gray-900)
  // so that every nested element gets that same color.
  const contentWrapperClasses =
    theme === "dark"
      ? "flex-1 w-full overflow-y-auto p-6 md:p-10 custom-scrollbar bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 [&_*]:text-gray-100"
      : "flex-1 w-full overflow-y-auto p-6 md:p-10 custom-scrollbar bg-white text-gray-900 [&_*]:text-gray-900";

  const footerClasses =
    theme === "dark"
      ? "p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 flex justify-end"
      : "p-4 bg-gray-50 border-t border-gray-200 flex justify-end";

  const closeButtonHeaderClasses =
    theme === "dark"
      ? "p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors"
      : "p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors";

  const closeButtonFooterClasses =
    theme === "dark"
      ? "px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      : "px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition-colors";

  const themeToggleButtonClasses =
    theme === "dark"
      ? "p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors"
      : "p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={rootClasses}
    >
      {/* ===== HEADER ===== */}
      <div className={headerClasses}>
        <div className="flex items-center gap-3">
          {icon}
          <h2 className={titleClasses}>{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className={themeToggleButtonClasses}>
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-gray-900" />
            )}
          </button>
          <button onClick={onClose} className={closeButtonHeaderClasses}>
            <X
              className={
                theme === "dark"
                  ? "w-5 h-5 text-white"
                  : "w-5 h-5 text-gray-900"
              }
            />
          </button>
        </div>
      </div>

      {/* ===== ANIMATED CONTENT WRAPPER (force‐override all nested text color) ===== */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className={contentWrapperClasses}
      >
        {content}
      </motion.div>

      {/* ===== FOOTER ===== */}
      <div className={footerClasses}>
        <button onClick={onClose} className={closeButtonFooterClasses}>
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default FullScreenReader;
