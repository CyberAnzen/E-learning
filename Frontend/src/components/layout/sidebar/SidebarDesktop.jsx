import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarItem from "./SidebarItem";

const SidebarDesktop = ({
  isOpen,
  isPinned,
  setIsPinned,
  setSidebarHovered,
  courseData,
  currentChapter,
  onChapterSelect,
  title,
  sidebarHeader,
  className = "",
}) => {
  return (
    <>
      {/* Blur Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="desktop-blur-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 backdrop-blur-md bg-black/30 z-20 pointer-events-auto"
            onClick={() => {
              setIsPinned(false);
              setSidebarHovered(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        className={`hidden mt-20 lg:block md:block fixed left-0 top-0 h-full z-30 overflow-x-hidden w-64 pointer-events-auto ${className}`}
        variants={{
          hidden: { x: -256, opacity: 0.5 },
          visible: { x: 0, opacity: 1 },
        }}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => {
          if (!isPinned) {
            setSidebarHovered(false);
          }
        }}
      >
        <div className="w-64 h-full overflow-y-auto bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-xl border-r border-cyan-500/20 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
          {/* Cyber accent lines */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/80 via-cyan-400/50 to-blue-600/80"></div>
          <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-cyan-400/50 via-blue-600/30 to-cyan-400/50"></div>
          
          {/* Header */}
          {sidebarHeader || (
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent pointer-events-none"></div>
              <h1 className="p-5 text-white font-bold text-xl relative">
                {title}
                <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-cyan-400/50"></span>
              </h1>
            </div>
          )}
          
          {/* Content */}
          <div className="mt-3 pb-4">
            {courseData.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                currentChapter={currentChapter}
                onChapterSelect={onChapterSelect}
              />
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default React.memo(SidebarDesktop);