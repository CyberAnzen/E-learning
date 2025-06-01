import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const SidebarButton = ({ isOpen, isPinned, setIsPinned, setButtonHovered }) => {
  return (
    <motion.div
      className={`
        hidden md:block
        fixed top-1/2 transform -translate-y-1/2 z-40
        transition-opacity duration-500
        ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
      // Keep the left‐slide animation intact:
      animate={{ left: isOpen ? 264 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsPinned((prev) => !prev);
        }}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        className={`
          absolute left-0 w-6 h-16  items-center justify-center
          bg-gradient-to-r from-gray-800/90 via-gray-800/80 to-gray-700/80 backdrop-blur-md
          rounded-r-md border-r border-t border-b border-cyan-500/30
          transition-all duration-300 hover:from-gray-700/90 hover:to-gray-600/90
          shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_20px_rgba(8,145,178,0.4)]
          group inline-flex
        `}
      >
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            x: isOpen ? -2 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.5)] group-hover:text-cyan-300" />
        </motion.div>
      </button>
    </motion.div>
  );
};

export default SidebarButton;
