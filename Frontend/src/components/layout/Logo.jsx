import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Logo = React.memo(() => {
  const [showCyber, setShowCyber] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setShowCyber((prev) => !prev);
      },
      showCyber ? 9000 : 4000
    );

    return () => clearTimeout(timeout);
  }, [showCyber]);

  const imgAnimation = useMemo(
    () => ({
      scale: [1, 1.05, 1],
      filter: [
        "drop-shadow(0 0 8px #01ffdb)",
        "drop-shadow(0 0 16px #01ffdb)",
        "drop-shadow(0 0 8px #01ffdb)",
      ],
    }),
    []
  );

  const imgTransition = useMemo(
    () => ({
      duration: 2.5,
      repeat: Infinity,
      repeatType: "reverse",
    }),
    []
  );

  const cubeStyle = useMemo(
    () => ({
      perspective: "1000px",
      transformStyle: "preserve-3d",
    }),
    []
  );

  return (
    <motion.div className="cube-container" style={cubeStyle}>
      <AnimatePresence mode="wait">
        <motion.div
          key="cyber"
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 90, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Link to="/">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative w-10 flex items-center h-12">
                <center>
                  <motion.img
                    src="/favicon.png"
                    alt="CyberAnzen Logo"
                    className="w-13 h-11 object-cover"
                    style={{ filter: "drop-shadow(0 0 8px #01ffdb)" }}
                    animate={imgAnimation}
                    transition={imgTransition}
                  />
                </center>
                <div className="absolute inset-0 bg-gradient-to-r from-[#01ffdb]/10 to-[#00c3ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#16e8da] via-[#01fff7] to-[#01ffdb] tracking-tight hover:from-[#00c3ff] hover:to-[#01ffdb] transition-all duration-300">
                CyberAnzen
              </h1>
            </motion.div>
          </Link>
        </motion.div>
        {/* {false ? (
          <motion.div
            key="cyber"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link to="/about">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative w-10 flex items-center h-15">
                  <center>
                    <motion.img
                      src="/favicon.png"
                      alt="CyberAnzen Logo"
                      className="w-13 h-11 object-cover"
                      style={{ filter: "drop-shadow(0 0 8px #01ffdb)" }}
                      animate={imgAnimation}
                      transition={imgTransition}
                    />
                  </center>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#01ffdb]/10 to-[#00c3ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#16e8da] via-[#01fff7] to-[#01ffdb] tracking-tight hover:from-[#00c3ff] hover:to-[#01ffdb] transition-all duration-300">
                  CyberAnzen
                </h1>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <Link to="/about">
            <motion.div
              key="srmist"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-40 h-15 overflow-hidden">
                <img
                  src="https://lirp.cdn-website.com/5db65efd/dms3rep/multi/opt/Mask-group--282-29-1920w.png"
                  alt="SRMIST Trichy"
                  className="w-full h-14 object-cover transform transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#01ffdb]/5 to-[#00c3ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          </Link>
        )} */}
      </AnimatePresence>
    </motion.div>
  );
});

export default Logo;
