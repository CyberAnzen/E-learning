import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import SidebarItem from "./SidebarItem";

const SidebarMobile = ({
  isSidebarOpen,
  setIsSidebarOpen,
  scrolled,
  courseData,
  currentChapter,
  onChapterSelect,
  title,
}) => {
  return (
    <>
      {/* Mobile Menu Button */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={`fixed w-full top-8 sm:right-6 md:hidden z-50 transition-all duration-500 bg-transparent ${
          scrolled ? "py-2" : "border-transparent shadow-none py-4"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden group relative ml-4 p-2 rounded-xl overflow-hidden transition-colors"
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {isSidebarOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -180, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 180, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <X className="w-6 h-6 text-white relative z-10 drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 180, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -180, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Menu className="w-6 h-6 text-white relative z-10 drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]" />
              </motion.div>
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-md"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -320, opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-xl min-h-screen overflow-y-auto border-r border-cyan-500/20 shadow-[5px_0_30px_rgba(0,0,0,0.5)]"
            >
              {/* Cyber accent lines */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/80 via-cyan-400/50 to-blue-600/80"></div>
              <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-cyan-400/50 via-blue-600/30 to-cyan-400/50"></div>
              
              {/* Header */}
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent pointer-events-none"></div>
                <h1 className="p-5 mt-22 text-white font-bold text-xl relative">
                  {title}
                  <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-cyan-400/50"></span>
                </h1>
              </div>
              
              {/* Content */}
              <div className="mt-3 pb-4">
                {courseData.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    currentChapter={currentChapter}
                    onChapterSelect={(item) => {
                      onChapterSelect(item);
                      setIsSidebarOpen(false);
                    }}
                  />
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarMobile;