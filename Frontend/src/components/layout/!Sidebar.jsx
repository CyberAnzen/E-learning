import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Medal, Menu, X } from "lucide-react";

const Sidebar = ({
  isPreview = false,
  courseData,
  currentChapter,
  onChapterSelect,
  customButton,
  sidebarHeader,
  className = "",
  title = "Course Contents",
}) => {
  const [isPinned, setIsPinned] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isOpen = isPinned || isButtonHovered || isSidebarHovered;

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={`fixed w-full top-8 sm:right-6 md:hidden z-50 transition-all duration-500 bg-transparent ${
          scrolled ? " py-2" : "border-transparent shadow-none py-4"
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#01ffdb]/10 to-[#00c3ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {isSidebarOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <X className="w-6 h-6 text-white relative z-10" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 180 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: -180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Menu className="w-6 h-6 text-white relative z-10" />
              </motion.div>
            )}
          </button>
        </div>
      </motion.nav>

      {/* Blur Overlay */}
      <AnimatePresence>
        {(isPinned || (isSidebarHovered && isDesktop)) && (
          <motion.div
            key="desktop-blur-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-lg bg-black/20 z-20 pointer-events-auto"
            onClick={() => {
              setIsPinned(false);
              setIsSidebarHovered(false);
              if (!isDesktop) setIsOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        className={`hidden mt-20 lg:block md:block fixed left-0 top-0 h-full z-30 overflow-x-hidden w-64 pointer-events-auto ${className}`}
        variants={{ hidden: { x: -256 }, visible: { x: 0 } }}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        onMouseEnter={() => {
          if (isDesktop) {
            setIsSidebarHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (isDesktop && !isPinned) {
            setIsSidebarHovered(false);
          }
        }}
      >
        <div className="w-64 h-full bg-gradient-to-t from-gray-600/90 via-gray-700/90 to-gray-800/90 overflow-y-auto">
          {sidebarHeader || (
            <h1 className="p-5 bg-gradient-to-b from-gray-200/30 via-gray-700/80 to-black/30 text-white font-bold text-xl">
              {title}
            </h1>
          )}
          <div className="mt-3">
            {courseData.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onChapterSelect(item);
                  setIsSidebarOpen(false);
                }}
                className={`mx-2 mb-2 p-4 rounded-lg transition-all cursor-pointer flex items-center justify-between
                  ${
                    currentChapter.id === item.id
                      ? "bg-gray-700/60 shadow-lg scale-102 border-l-4 border-blue-500"
                      : "hover:bg-gray-700/40"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-blue-400" />
                  <p className="text-white font-medium">{item.chapter}</p>
                </div>
                {item.completed && (
                  <Medal className="w-5 h-5 text-yellow-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-t from-gray-100/20 via-gray-600/30 to-gray-400/20 min-h-screen overflow-y-auto"
          >
            <h1 className="p-5 mt-22 bg-gradient-to-b from-gray-200/30 via-gray-700/80 to-black/30 text-white font-bold text-xl">
              {title}
            </h1>
            <div className="mt-3">
              {courseData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onChapterSelect(item);
                    setIsSidebarOpen(false);
                  }}
                  className={`mx-2 mb-2 p-4 rounded-lg transition-all cursor-pointer flex items-center justify-between
                    ${
                      currentChapter.id === item.id
                        ? "bg-gray-700/60 shadow-lg scale-102 border-l-4 border-blue-500"
                        : "hover:bg-gray-700/40"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-blue-400" />
                    <p className="text-white font-medium">{item.chapter}</p>
                  </div>
                  {item.completed && (
                    <Medal className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {customButton || (
        <motion.div
          className="hidden md:block fixed top-1/2 transform -translate-y-1/2 z-40"
          style={{ width: "24px", height: "60px" }}
          animate={{ left: isOpen ? 264 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPinned((prev) => !prev);
              if (isPinned) {
                setIsSidebarHovered(false);
              }
            }}
            onMouseEnter={() => isDesktop && setIsButtonHovered(true)}
            onMouseLeave={() => isDesktop && setIsButtonHovered(false)}
            className={`absolute left-0 w-6 h-16 flex items-center justify-center
              bg-gradient-to-r from-gray-800/90 to-gray-700/90 rounded-r-md
              transition-all duration-300 hover:from-gray-700/90 hover:to-gray-600/90
              group ${isOpen ? "opacity-0 md:opacity-100" : "opacity-100"}
              ${isDesktop ? "delay-150" : "delay-75"}
              ${isPinned || isOpen ? "hidden md:hidden" : "inline-flex"}`}
          >
            <motion.div
              animate={{
                rotate: isOpen ? 180 : 0,
                x: isOpen ? -2 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
            </motion.div>
          </button>
        </motion.div>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
