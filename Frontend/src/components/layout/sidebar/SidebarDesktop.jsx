import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarItem from "./SidebarItem";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  clicked,
  setClicked,
  ClassificationId,
}) => {
  const isAdmin = true;
  const [hover, setHover] = useState();
  const Navigate = useNavigate();

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
                isClicked={clicked}
                setClicked={setClicked}
              />
            ))}
            {isAdmin && (
              <section
                onClick={() => {
                  Navigate("/lesson/create", {
                    state: { ClassificationId: ClassificationId },
                  });
                }}
                onMouseEnter={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                className={`mx-2 mb-2 p-6 rounded-lg transition-all cursor-pointer backdrop-blur-sm flex justify-center py-9
                ${
                  clicked
                    ? "bg-gradient-to-r from-blue-500/20 to-cyan-400/10 shadow-[0_0_15px_rgba(59,130,246,0.3)] border-l-4 border-cyan-400/60 scale-[1.02]"
                    : "hover:bg-white/5 bg-cyan-900/25 hover:shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                }
              group relative overflow-hidden`}
              >
                {" "}
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 ${
                    clicked
                      ? "bg-gradient-to-r from-teal-400/20 via-teal-600/20 to-transparent"
                      : "bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                  } transition-opacity duration-300`}
                />
                {/* Cyber accent line */}
                <div
                  className={`absolute h-full w-1 left-0 top-0 ${
                    clicked
                      ? "bg-cyan-600/40 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                      : "bg-gray-700"
                  }`}
                />
                {/*Plus Button*/}
                <div
                  className={`w-10 h-10 rounded-full  flex items-center justify-center
                    ${
                      !clicked && hover ? "bg-cyan-300/35" : "bg-gray-400/15 "
                    }`}
                >
                  <Plus size={27} />
                </div>
              </section>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default React.memo(SidebarDesktop);
