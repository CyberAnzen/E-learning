import React, { useState, useEffect, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import SidebarDesktop from "./SidebarDesktop";
import SidebarMobile from "./SidebarMobile";
import SidebarButton from "./SidebarButton";
import { AppContext } from "../../../context/AppContext";

const Sidebar = ({
  isPreview = false,
  courseData,
  currentChapter,
  onChapterSelect,
  customButton,
  sidebarHeader,
  className = "",
  ClassificationId,
  title = "Course Contents",
}) => {
  const [isPinned, setIsPinned] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Using a debounce-like approach to make hover behavior more responsive
  const [hoverIntent, setHoverIntent] = useState(false);

  useEffect(() => {
    // Check if we're on desktop
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    // Track scroll for mobile header
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkDesktop);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Optimize hover behavior with immediate response
  useEffect(() => {
    const isHovering = isSidebarHovered || isButtonHovered;
    if (isHovering) {
      setHoverIntent(true);
    } else {
      // Small delay before closing to prevent accidental closures
      const timer = setTimeout(() => {
        if (!isPinned) {
          setHoverIntent(false);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSidebarHovered, isButtonHovered, isPinned]);

  const { LearnAdd, setLearnAdd } = useContext(AppContext);
  // Determine if sidebar should be open
  const isOpen = isPinned || hoverIntent;
  const isAdmin = true;
  return (
    <>
      {/* Mobile Sidebar */}
      <SidebarMobile
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        scrolled={scrolled}
        courseData={courseData}
        currentChapter={currentChapter}
        onChapterSelect={onChapterSelect}
        title={title}
        clicked={LearnAdd}
        setClicked={setLearnAdd}
        ClassificationId={ClassificationId}
      />

      {/* Desktop Sidebar */}
      <SidebarDesktop
        isOpen={isOpen}
        isPinned={isPinned}
        setIsPinned={setIsPinned}
        setSidebarHovered={setIsSidebarHovered}
        courseData={courseData}
        currentChapter={currentChapter}
        onChapterSelect={onChapterSelect}
        title={title}
        sidebarHeader={sidebarHeader}
        className={className}
        clicked={LearnAdd}
        setClicked={setLearnAdd}
        ClassificationId={ClassificationId}
      />

      {/* Toggle Button */}
      {customButton || (
        <SidebarButton
          isOpen={isOpen}
          isPinned={isPinned}
          setIsPinned={setIsPinned}
          setButtonHovered={setIsButtonHovered}
        />
      )}
    </>
  );
};

export default React.memo(Sidebar);
