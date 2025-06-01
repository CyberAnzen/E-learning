import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Home,
  BookOpen,
  Trophy,
  User,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

export default function Navbar() {
  const { user } = useAppContext();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const blacklistRoutes = ["/login", "/forget-password", "/signup"];
  const isBlacklisted = blacklistRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const menublacklist = ["/learn/"];
  const ismenuBlacklisted = menublacklist.some((route) =>
    location.pathname.startsWith(route)
  );
  const [showCyber, setShowCyber] = useState(true);
  const [bottomVisible, setBottomVisible] = useState(true);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // initialize lastScrollY
    lastScrollY.current = window.scrollY;

    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchCurrentY.current = touchStartY.current;
    };

    const onTouchMove = (e) => {
      touchCurrentY.current = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      const delta = touchCurrentY.current - touchStartY.current;
      if (delta < -30) setBottomVisible(false); // swipe up → hide
      else if (delta > 30) setBottomVisible(true); // swipe down → show
    };

    const onWheel = (e) => {
      // e.deltaY > 0 means scrolling down (content moves up)
      if (e.deltaY > 30) setBottomVisible(false);
      else if (e.deltaY < -30) setBottomVisible(true);
    };

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (delta > 30) setBottomVisible(false); // scroll down → hide
      else if (delta < -30) setBottomVisible(true); // scroll up → show
      lastScrollY.current = currentY;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect(() => {
    // Set timeout based on which slide is visible:
    // CyberAnzen visible for 12s, SRMIST for 3s
    const timeout = setTimeout(
      () => {
        setShowCyber((prev) => !prev);
      },
      showCyber ? 9000 : 4000
    );

    return () => clearTimeout(timeout);
  }, [showCyber]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu if screen becomes large
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Learn", icon: BookOpen, path: "/learn" },
    { name: "Contest", icon: Trophy, path: "/contest" },
    user
      ? { name: "Profile", icon: UserCircle, path: "/profile" }
      : { name: "Login", icon: User, path: "/login" },
  ];
  return (
    <>
      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={`fixed w-full top-0 z-50 transition-all duration-500 bg-gradient-to-r from-black/90 via-[#1a2234]/90 to-black/90 backdrop-blur-lg border-b ${
          scrolled
            ? "border-[#01ffdb]/20 shadow-[0_8px_32px_rgba(1,255,219,0.15)] py-2"
            : "border-transparent shadow-none py-4"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6">
          <motion.div
            className="cube-container"
            style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="wait">
              {showCyber ? (
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
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <div className="relative w-10 flex items-center h-15">
                        <center>
                          <motion.img
                            src="favicon.png"
                            alt="CyberAnzen Logo"
                            className="w-13 h-11 object-cover"
                            style={{ filter: "drop-shadow(0 0 8px #01ffdb)" }}
                            animate={{
                              scale: [1, 1.05, 1],
                              filter: [
                                "drop-shadow(0 0 8px #01ffdb)",
                                "drop-shadow(0 0 16px #01ffdb)",
                                "drop-shadow(0 0 8px #01ffdb)",
                              ],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
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
                    <div className="relative w-30 h-15 overflow-hidden ">
                      <img
                        src="https://lirp.cdn-website.com/5db65efd/dms3rep/multi/opt/Mask-group--282-29-1920w.png"
                        alt="SRMIST Trichy"
                        className="w-full h-14 object-cover transform transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#01ffdb]/5 to-[#00c3ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                </Link>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative px-4 py-2 group"
                >
                  <motion.div
                    className={`absolute inset-0 rounded-xl ${
                      isActive
                        ? "bg-gradient-to-r from-[#01ffdb]/20 to-[#00c3ff]/20"
                        : "bg-transparent hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent"
                    } transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 17,
                    }}
                  />
                  <div className="relative flex items-center gap-2">
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-[#01ffdb]"
                          : "text-white/70 group-hover:text-[#01ffdb]"
                      } transition-all duration-300`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-white"
                          : "text-white/70 group-hover:text-white"
                      } transition-all duration-300`}
                    >
                      {item.name}
                    </span>
                  </div>
                  {isActive && (
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#01ffdb] via-[#00c3ff] to-[#01ffdb] bg-[length:200%_100%] animate-gradient"
                      layoutId="navbar-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          {!ismenuBlacklisted && (
            <motion.button
              className="md:hidden relative p-2 rounded-xl overflow-hidden group"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#01ffdb]/10 to-[#00c3ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {mobileMenuOpen ? (
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
            </motion.button>
          )}
        </div>
      </motion.nav>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-72 bg-gradient-to-b from-[#1a2234] to-black shadow-[-20px_0_60px_rgba(1,255,219,0.1)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col p-5 pt-20 h-full">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 my-1 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                        isActive
                          ? "bg-gradient-to-r from-[#01ffdb]/10 to-[#00c3ff]/10 text-white"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#01ffdb]/5 to-[#00c3ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.05 }}
                      />
                      <item.icon
                        className={`w-5 h-5 relative z-10 ${
                          isActive
                            ? "text-[#01ffdb]"
                            : "group-hover:text-[#01ffdb]"
                        } transition-colors duration-300`}
                      />
                      <span className="font-medium relative z-10">
                        {item.name}
                      </span>
                      {isActive && (
                        <motion.div
                          className="w-1 h-6 bg-gradient-to-b from-[#01ffdb] to-[#00c3ff] rounded-full ml-auto"
                          layoutId="sidebar-indicator"
                        />
                      )}
                    </Link>
                  );
                })}

                <div className="mt-auto pt-6 border-t border-white/10">
                  <div className="text-xs text-white/40 mb-2 font-mono">
                    © 2025 CyberAnzen
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Bottom Navbar for Mobile */}
      {!isBlacklisted && (
        <motion.div
          className="fixed bottom-0 w-full md:hidden z-30 bg-gradient-to-r from-black/90 via-[#1a2234]/90 to-black/90 border-t border-[#01ffdb]/10 backdrop-blur-xl"
          initial={{ y: 0 }}
          animate={{ y: bottomVisible ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          style={{ boxShadow: "0 -8px 32px rgba(1,255,219,0.1)" }}
        >
          <div className="flex justify-around py-3 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative flex flex-col items-center px-3 py-1 group"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`relative p-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-[#01ffdb]/20 to-[#00c3ff]/20"
                        : "group-hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#01ffdb]/10 to-[#00c3ff]/10 rounded-full"
                        layoutId="mobile-nav-background"
                      />
                    )}
                    <item.icon
                      className={`w-5 h-5 relative z-10 transition-colors duration-300 ${
                        isActive
                          ? "text-[#01ffdb]"
                          : "text-white/60 group-hover:text-[#01ffdb]"
                      }`}
                    />
                  </motion.div>
                  <span
                    className={`text-xs mt-1 font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-white/60 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
      )
    </>
  );
}
