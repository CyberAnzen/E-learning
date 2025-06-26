import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, X } from "lucide-react";

const NavigationControls = ({
  questions,
  currentQuestionIndex,
  answers,
  onPrevious,
  onNext,
  onQuestionSelect,
}) => {
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [needsScrolling, setNeedsScrolling] = useState(false);

  // Track touch start position and time for tap detection
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Threshold values for tap detection
  const TAP_THRESHOLD = 5; // pixels
  const TAP_TIME_THRESHOLD = 300; // milliseconds

  // Check if scrolling is needed based on container and content width
  const checkScrollNeeded = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const contentWidth = container.scrollWidth;
      const containerWidth = container.clientWidth;
      setNeedsScrolling(contentWidth > containerWidth);
    }
  };

  // Check scroll need on mount and resize
  useEffect(() => {
    checkScrollNeeded();

    const handleResize = () => {
      checkScrollNeeded();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [questions.length]);

  // Auto-scroll to current question
  useEffect(() => {
    if (scrollContainerRef.current && questions.length > 0) {
      const container = scrollContainerRef.current;
      const activeButton = container.querySelector(
        `[data-question-index="${currentQuestionIndex}"]`
      );

      if (activeButton) {
        const containerWidth = container.offsetWidth;
        const buttonWidth = activeButton.offsetWidth;
        const buttonLeft = activeButton.offsetLeft;
        const scrollPosition =
          buttonLeft - containerWidth / 2 + buttonWidth / 2;

        // Use timeout to ensure proper rendering
        const timer = setTimeout(() => {
          container.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: "smooth",
          });
          setIsInitialized(true);
          checkScrollNeeded();
        }, 50);

        return () => clearTimeout(timer);
      }
    }
  }, [currentQuestionIndex, questions.length]);

  // Touch/Mouse drag handlers for smooth scrolling
  const handleMouseDown = (e) => {
    if (!needsScrolling) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  // Improved touch handling with tap detection
  const handleTouchStart = (e) => {
    if (!needsScrolling) return;

    // Record touch start position and time
    touchStartRef.current = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
      time: Date.now(),
    };

    setIsDragging(false); // Reset dragging state
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !needsScrolling) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!needsScrolling) return;

    // Calculate movement distance
    const touch = e.touches[0];
    const dx = Math.abs(touch.pageX - touchStartRef.current.x);
    const dy = Math.abs(touch.pageY - touchStartRef.current.y);

    // Only activate dragging if movement exceeds threshold
    if (!isDragging && (dx > TAP_THRESHOLD || dy > TAP_THRESHOLD)) {
      setIsDragging(true);
    }

    if (isDragging) {
      const x = touch.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    if (!needsScrolling) return;
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleTouchEnd = (e) => {
    if (!needsScrolling) return;

    // Check if this was a tap (not a drag)
    const timeElapsed = Date.now() - touchStartRef.current.time;
    if (!isDragging && timeElapsed < TAP_TIME_THRESHOLD) {
      // Find the tapped element
      const touch = e.changedTouches[0];
      const tappedElement = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      );

      // If it's a question button, trigger its click handler
      if (tappedElement && tappedElement.closest("[data-question-index]")) {
        const button = tappedElement.closest("[data-question-index]");
        const index = parseInt(button.getAttribute("data-question-index"), 10);
        onQuestionSelect(index);
      }
    }

    setIsDragging(false);
  };

  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-md border-t-2 border-cyan-400/30 px-2 sm:px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 lg:px-6 py-2 sm:py-3 bg-black/60 hover:bg-black/80 disabled:bg-black/30 disabled:text-gray-500 text-cyan-300 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 disabled:cursor-not-allowed backdrop-blur-sm border-2 border-cyan-400/30 shadow-lg shadow-cyan-400/20 relative overflow-hidden flex-shrink-0 text-xs sm:text-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
          <span className="relative z-10 hidden sm:inline">PREV</span>
          <span className="relative z-10 hidden lg: -ml-2 lg:inline">IOUS</span>
        </motion.button>

        <div
          ref={scrollContainerRef}
          className={`flex items-center flex-1 mx-1 sm:mx-2 lg:mx-4 relative ${
            needsScrolling ? "gap-2 sm:gap-3" : "gap-1 sm:gap-2 lg:gap-3"
          }`}
          style={{
            overflowX: needsScrolling ? "auto" : "visible",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            cursor: needsScrolling
              ? isDragging
                ? "grabbing"
                : "grab"
              : "default",
            maxWidth: "100%",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Hide scrollbar with CSS */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div
            className={`flex items-center w-full ${
              needsScrolling
                ? "justify-start gap-2 sm:gap-3 px-1 sm:px-2 py-1"
                : "justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 px-1 py-1"
            }`}
            style={{
              minWidth: needsScrolling ? "max-content" : "auto",
            }}
          >
            {questions.map((_, index) => {
              const questionId = questions[index].id;
              const answerState = answers[questionId];
              const isAnswered = answerState?.validation;
              const isCorrect = answerState?.validation?.isCorrect;

              return (
                
                
                <motion.button
                  key={index}
                  data-question-index={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onQuestionSelect(index)}
                  className={`${
                    needsScrolling
                      ? "min-w-[40px] w-10 h-10 sm:min-w-[48px] sm:w-12 sm:h-12"
                      : "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                  } rounded-xl sm:rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm font-bold relative overflow-hidden flex-shrink-0 ${
                    index === currentQuestionIndex
                      ? "border-cyan-400 bg-gradient-to-br from-cyan-400 to-teal-500 text-black shadow-2xl shadow-cyan-400/30 transform scale-110"
                      : isAnswered
                      ? isCorrect
                        ? "border-green-400 bg-gradient-to-br from-green-400 to-emerald-500 text-black shadow-2xl shadow-green-400/30"
                        : "border-red-400 bg-gradient-to-br from-red-400 to-pink-500 text-black shadow-2xl shadow-red-400/30"
                      : "border-cyan-400/30 bg-black/40 text-cyan-300 hover:border-cyan-400/50 hover:bg-black/60 shadow-lg shadow-cyan-400/10"
                  }`}
                >
                  {/* Cyber accent line */}
                  <div
                    className={`absolute top-0 left-0 w-full h-0.5 sm:h-1 ${
                      index === currentQuestionIndex
                        ? "bg-gradient-to-r from-cyan-300 to-teal-400"
                        : isAnswered
                        ? isCorrect
                          ? "bg-gradient-to-r from-green-300 to-emerald-400"
                          : "bg-gradient-to-r from-red-300 to-pink-400"
                        : "bg-gradient-to-r from-cyan-400/30 to-teal-500/30"
                    }`}
                  ></div>

                  {/* Animated pulse effect for current question */}
                  {index === currentQuestionIndex && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-teal-500/20 rounded-xl sm:rounded-2xl"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-center w-full h-full">
                    {isAnswered ? (
                      isCorrect ? (
                        <CheckCircle
                          className={`${
                            needsScrolling
                              ? "w-4 h-4 sm:w-6 sm:h-6"
                              : "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
                          }`}
                        />
                      ) : (
                        <X
                          className={`${
                            needsScrolling
                              ? "w-4 h-4 sm:w-6 sm:h-6"
                              : "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
                          }`}
                        />
                      )
                    ) : (
                      <span
                        className={`font-bold leading-none transition-opacity ${
                          isInitialized ? "opacity-100" : "opacity-0"
                        } ${
                          needsScrolling
                            ? "text-xs sm:text-base"
                            : "text-xs sm:text-sm md:text-base lg:text-lg"
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          disabled={isLastQuestion}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 lg:px-6 py-2 sm:py-3 bg-black/60 hover:bg-black/80 disabled:bg-black/30 disabled:text-gray-500 text-cyan-300 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 disabled:cursor-not-allowed backdrop-blur-sm border-2 border-cyan-400/30 shadow-lg shadow-cyan-400/20 relative overflow-hidden flex-shrink-0 text-xs sm:text-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 hidden sm:inline">NEXT</span>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
        </motion.button>
      </div>

      {/* Scroll indicators - only show when scrolling is needed */}
      {needsScrolling && (
        <div className="flex justify-center mt-2">
          <div className="flex gap-1">
            {Array.from({ length: Math.ceil(questions.length / 5) }).map(
              (_, idx) => (
                <div
                  key={idx}
                  className="w-1.5 h-0.5 sm:w-2 sm:h-1 bg-cyan-400/30 rounded-full"
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

NavigationControls.propTypes = {
  questions: PropTypes.array.isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  answers: PropTypes.object.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onQuestionSelect: PropTypes.func.isRequired,
};

export default NavigationControls;
