import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../index.css";

const Intro = () => {
  const fullText = "CyberAnzen";
  const scrambleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:'\",.<>?/";
  const [cyberAnzenText, setCyberAnzenText] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  const currentIndexRef = useRef(0);

  // Detect mobile devices for performance optimizations
  useEffect(() => {
    const checkMobile = () => {
      return (
        window.matchMedia("(max-width: 768px)").matches ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };
    setIsMobile(checkMobile());
  }, []);

  // Optimized animation using requestAnimationFrame
  useEffect(() => {
    startTimeRef.current = performance.now();
    const tempText = new Array(fullText.length).fill(" ");

    const animate = (timestamp) => {
      const elapsed = timestamp - startTimeRef.current;

      if (elapsed < 500) {
        // Scramble phase
        for (let i = currentIndexRef.current; i < fullText.length; i++) {
          tempText[i] =
            scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
        setCyberAnzenText(tempText.join(""));
      } else {
        // Reveal phase
        const revealIndex = Math.min(
          fullText.length,
          Math.floor((elapsed - 500) / (isMobile ? 120 : 80))
        );

        if (revealIndex > currentIndexRef.current) {
          currentIndexRef.current = revealIndex;

          for (let i = 0; i < currentIndexRef.current; i++) {
            tempText[i] = fullText[i];
          }

          for (let i = currentIndexRef.current; i < fullText.length; i++) {
            tempText[i] =
              scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }

          setCyberAnzenText(tempText.join(""));

          if (currentIndexRef.current === fullText.length) {
            setIsRevealed(true);
            return;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile]);

  const textShadowStyle = isRevealed
    ? "0 0 15px rgba(1,255,219,1), 0 0 30px rgba(1,255,219,0.8), 0 0 45px rgba(1,255,219,0.6), 0 0 60px rgba(1,255,219,0.4)"
    : "0 0 10px rgba(1,255,219,0.8), 0 0 20px rgba(1,255,219,0.6), 0 0 30px rgba(1,255,219,0.4)";

  const containerVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.03,
      },
    },
  };

  const letterVariant = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative backdrop-blur-md min-h-screen bg-gradient-to-br from-cyan-900/40 via-black to-cyan-900/40 flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Optimized favicon with enhanced glow */}
      <motion.img
        src="/favicon.png"
        alt="CyberAnzen Logo"
        className={`w-32 md:w-48 ${isMobile ? "" : "glitch-effect"}`}
        initial={{ opacity: 0, scale: 0.9, filter: "brightness(0)" }}
        animate={
          isRevealed
            ? {
                opacity: 1,
                scale: 1,
                filter: "brightness(1) drop-shadow(0 0 15px rgba(1,255,219,1))",
              }
            : { opacity: 0, scale: 0.9, filter: "brightness(0)" }
        }
        transition={{
          duration: 1.2,
          ease: "easeInOut",
          filter: { duration: 0.3 },
        }}
      />
      <br />

      {/* Main text container with cyber font */}
      <div className="relative">
        <div
          className="text-[#01ffdb] text-3xl md:text-5xl font-bold tracking-wider"
          style={{
            textShadow: textShadowStyle,
            willChange: "transform, opacity",
            transform: "translate3d(0,0,0)",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "0.2em",
          }}
        >
          {cyberAnzenText}
        </div>

        {/* Glitch layers with 0.3s durations */}
        {!isMobile && (
          <>
            <motion.div
              className="absolute top-0 left-0 text-[#00d4ff] text-3xl md:text-5xl font-bold tracking-wider mix-blend-screen"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: "0.2em",
                opacity: 0.12,
                filter: "blur(1px)",
                willChange: "transform, opacity",
                transform: "translate3d(0,0,0)",
              }}
              animate={{
                x: [0, -2, 0, 2, 0],
                y: [0, 1, 0, -1, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {cyberAnzenText}
            </motion.div>
            <motion.div
              className="absolute top-0 left-0 text-[#4dffe8] text-3xl md:text-5xl font-bold tracking-wider mix-blend-screen"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: "0.2em",
                opacity: 0.1,
                filter: "blur(1px)",
                willChange: "transform, opacity",
                transform: "translate3d(0,0,0)",
              }}
              animate={{
                x: [0, 2, 0, -2, 0],
                y: [0, -1, 0, 1, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.1,
              }}
            >
              {cyberAnzenText}
            </motion.div>
            <motion.div
              className="absolute top-0 left-0 text-[#26ffe0] text-3xl md:text-5xl font-bold tracking-wider mix-blend-screen"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: "0.2em",
                opacity: 0.08,
                filter: "blur(1px)",
                willChange: "transform, opacity",
                transform: "translate3d(0,0,0)",
              }}
              animate={{
                x: [0, -3, 0, 3, 0],
                y: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.2,
              }}
            >
              {cyberAnzenText}
            </motion.div>
          </>
        )}
      </div>

      {/* Subtext with cyber font and optimized animations */}
      <motion.div
        className="mt-6 flex items-center space-x-3"
        initial={{ opacity: 0 }}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <motion.img
          src="/Lock.svg"
          alt=" Security Lock Icon"
          className="w-5"
      
          animate={{
            rotate: [0, -5, 0, 5, 0],
            scale: [1, 1.05, 1, 1.05, 1],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="text-white text-sm sm:text-base md:text-xl font-bold"
          variants={containerVariant}
          initial="hidden"
          animate={isRevealed ? "visible" : "hidden"}
          style={{
            willChange: "transform, opacity",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "0.1em",
            textShadow:
              "0 0 10px rgba(1,255,219,0.5), 0 0 20px rgba(1,255,219,0.3)",
          }}
        >
          {"Break the Code Secure the Future".split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariant}
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Grid background with subtle animation */}
      <div
        className="absolute inset-0 bg-[linear-gradient(transparent_1px,_rgba(1,255,219,0.1)_1px),_linear-gradient(90deg,_transparent_1px,_rgba(1,255,219,0.1)_1px)] pointer-events-none"
        style={{
          backgroundSize: "30px 30px",
          opacity: 0.3,
          animation: !isMobile ? "gridMove 20s linear infinite" : "none",
          willChange: "transform, opacity",
        }}
      />

      {/* Particle effects for extra cyber feel */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#01ffdb] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow:
                  "0 0 10px #01ffdb, 0 0 20px #01ffdb, 0 0 30px rgba(1,255,219,0.5)",
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 1.5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Additional green accent elements */}
      {/* <div className="absolute top-10 left-10 w-2 h-2 bg-[#01ffdb] rounded-full animate-pulse shadow-[0_0_10px_#01ffdb]"></div>
      <div className="absolute bottom-10 right-10 w-3 h-3 bg-[#4dffe8] rounded-full animate-pulse shadow-[0_0_15px_#4dffe8]"></div>
      <div className="absolute top-1/2 left-5 w-1 h-1 bg-[#26ffe0] rounded-full animate-ping shadow-[0_0_8px_#26ffe0]"></div>
      <div className="absolute top-20 right-20 w-1 h-1 bg-[#00d4ff] rounded-full animate-ping shadow-[0_0_8px_#00d4ff]"></div> */}
    </div>
  );
};

export default React.memo(Intro);