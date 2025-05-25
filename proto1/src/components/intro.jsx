import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import "../index.css"
const Intro = () => {
  const fullText = "CyberAnzen";
  const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:'\",.<>?/";
  const [cyberAnzenText, setCyberAnzenText] = useState("");
  const [showGlitch, setShowGlitch] = useState(true);
  const [glowIntensity, setGlowIntensity] = useState(100);
  const [isRevealed, setIsRevealed] = useState(false);
  const [imageGlitchActive, setImageGlitchActive] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    let tempText = new Array(fullText.length).fill(" ");
    let scrambleInterval;
    let revealTimeout;
    
    const startScramble = () => {
      scrambleInterval = setInterval(() => {
        for (let i = currentIndex; i < fullText.length; i++) {
          tempText[i] = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
        setCyberAnzenText(tempText.join(""));
      }, 50);
    };

    const revealNextChar = () => {
      if (currentIndex < fullText.length) {
        tempText[currentIndex] = fullText[currentIndex];
        currentIndex++;
        setCyberAnzenText(tempText.join(""));
        
        if (currentIndex === fullText.length) {
          setIsRevealed(true);
          clearInterval(scrambleInterval);
          // After text reveal, set a fixed glow.
          setTimeout(() => {
            // Keeping glitch effects infinite by not disabling them.
            setGlowIntensity(120);
          }, 800);
        } else {
          revealTimeout = setTimeout(revealNextChar, 100);
        }
      }
    };

    startScramble();
    revealTimeout = setTimeout(revealNextChar, 800);

    return () => {
      clearInterval(scrambleInterval);
      clearTimeout(revealTimeout);
    };
  }, []);

  // Use a fixed glowing text-shadow after the reveal
  const textShadowStyle = isRevealed
    ? "0 0 20px rgba(1,255,219,1), 0 0 40px rgba(1,255,219,1)"
    : `
      0 0 ${glowIntensity * 0.1}px rgba(1, 255, 219, ${glowIntensity * 0.01}),
      0 0 ${glowIntensity * 0.2}px rgba(1, 255, 219, ${glowIntensity * 0.008}),
      0 0 ${glowIntensity * 0.4}px rgba(1, 255, 219, ${glowIntensity * 0.006}),
      0 0 ${glowIntensity * 0.8}px rgba(1, 255, 219, ${glowIntensity * 0.004})
    `;

  // Variants for letter-by-letter reveal animation for the new text
  const containerVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const letterVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Main Favicon Image */}
      <motion.img
        src="favicon.png"
        alt=""
        className={`w-40 md:w-50 ${imageGlitchActive ? "glitch-effect" : "glitch-effect"}`}
        initial={{ opacity: 0, scale: 0.9, filter: "brightness(0)" }}
        animate={
          isRevealed
            ? { opacity: 1, scale: 1, filter: "brightness(1) drop-shadow(0 0 10px rgba(1,255,219,1))" }
            : { opacity: 0, scale: 0.9, filter: "brightness(0)" }
        }
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <br />
      <div className="relative">
        <div 
          className="text-[#01ffdb] text-4xl md:text-5xl font-bold font-mono tracking-wider transition-colors duration-1000"
          style={{
            textShadow: textShadowStyle,
            transition: 'text-shadow 0.5s ease-out'
          }}
        >
          {cyberAnzenText}
        </div>

        {showGlitch && (
          <>
            <div 
              className="absolute top-0 left-0 text-[#FF0000] text-4xl md:text-5xl font-bold font-mono tracking-wider mix-blend-screen"
              style={{
                animation: 'rgbSplit 0.2s infinite linear',
                opacity: glowIntensity * 0.012,
                filter: 'blur(1px) saturate(150%)',
                transition: 'opacity 0.3s ease-out'
              }}
            >
              {cyberAnzenText}
            </div>
            <div 
              className="absolute top-0 left-0 text-[#00FF00] text-4xl md:text-5xl font-bold font-mono tracking-wider mix-blend-screen"
              style={{
                animation: 'rgbSplit 0.2s infinite linear',
                animationDelay: '-0.067s',
                opacity: glowIntensity * 0.01,
                filter: 'blur(1px)',
                transition: 'opacity 0.3s ease-out'
              }}
            >
              {cyberAnzenText}
            </div>
            <div 
              className="absolute top-0 left-0 text-[#0000FF] text-4xl md:text-5xl font-bold font-mono tracking-wider mix-blend-screen"
              style={{
                animation: 'rgbSplit 0.2s infinite linear',
                animationDelay: '-0.133s',
                opacity: glowIntensity * 0.01,
                filter: 'blur(1px)',
                transition: 'opacity 0.3s ease-out'
              }}
            >
              {cyberAnzenText}
            </div>

            <div 
              className="absolute top-0 left-0 text-[#01ffdb] text-4xl md:text-5xl font-bold font-mono tracking-wider"
              style={{
                animation: 'modernGlitch 0.1s infinite',
                opacity: glowIntensity * 0.009,
                transition: 'opacity 0.3s ease-out'
              }}
            >
              {cyberAnzenText}
            </div>
          </>
        )}
      </div>
      
      {/* New Section: Fade in after main image is visible */}
      <motion.div
         className="mt-8 flex items-center space-x-4"
         initial={{ opacity: 0 }}
         animate={ isRevealed ? { opacity: 1 } : { opacity: 0 } }
         transition={{ duration: 1, delay: 0.9 }}
      >
         <img 
           src="broken_security.png" 
           alt="" 
           className="w-7 md:w-7" 
           style={{ filter: "brightness(0) invert(1)" }} 
         />
         <motion.div
           className="text-white text-sm sm:text-lg md:text-1xl font-bold"
           variants={containerVariant}
           initial="hidden"
           animate="visible"
         >
           {"Break the Code Secure the Future".split("").map((char, index) => (
             <motion.span key={index} variants={letterVariant}>
               {char === " " ? "\u00A0" : char}
             </motion.span>
           ))}
         </motion.div>
      </motion.div>
      
      <div 
        className="absolute inset-0 bg-[linear-gradient(transparent_1px,_#000_1px),_linear-gradient(90deg,_transparent_1px,_#000_1px)]"
        style={{
          backgroundSize: '30px 30px',
          opacity: 0.2,
          animation: 'gridMove 20s linear infinite'
        }}
      />
    </div>
  );
};

export default Intro;
