import { useEffect, useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Phone,
  ExternalLink,
  ChevronUp,
  Shield,
} from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const location = useLocation();

  const [showCyber, setShowCyber] = useState(true);
  const menublacklist = ["/lesson/create"];
  const blacklistPatterns = [
    /^\/unauthorised$/, // no trailing slash
    /^\/lesson\/create$/,
    /^\/lesson\/update\/[a-f\d]{24}$/, // matches ObjectId format
  ];

  const ismenuBlacklisted = blacklistPatterns.some((pattern) =>
    pattern.test(location.pathname)
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const socialLinks = [
    { name: "GitHub", icon: Github, url: "https://github.com/cyberanzen" },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/company/cyberanzen",
    },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/cyberanzen" },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/cyberanzen",
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };
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
  if (ismenuBlacklisted) return null;
  return (
    <footer className="bg-gray-900 border-t border-gray-800 bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Scroll to top button */}
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-center">
        <motion.button
          onClick={scrollToTop}
          className="bg-gray-800 hover:bg-gray-700 p-2 sm:p-3 rounded-full group transition-all duration-300"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp
            className="text-[#01ffdb] group-hover:text-white transition-colors"
            size={20}
          />
        </motion.button>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* About section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Logo />
            </div>
            <p className="text-gray-400 text-sm sm:text-base">
              Exploring the digital frontier, securing the future. A student-run
              cybersecurity club dedicated to learning, collaboration, and
              innovation.
            </p>
            <div className="flex space-x-3 sm:space-x-4 pt-2 sm:pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-1.5 sm:p-2 rounded-full hover:bg-[#01ffdb]/20 transition-colors group"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#01ffdb] transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 relative">
              Contact Us
              <span className="absolute bottom-0 left-0 w-10 sm:w-12 h-0.5 bg-[#01ffdb]"></span>
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#01ffdb] mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">
                    Email
                  </p>
                  <a
                    href="mailto:contact@cyberanzen.org"
                    className="text-gray-400 hover:text-[#01ffdb] transition-colors text-xs sm:text-sm"
                  >
                    contact@cyberanzen.org
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#01ffdb] mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">
                    Phone
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="text-gray-400 hover:text-[#01ffdb] transition-colors text-xs sm:text-sm"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-[#01ffdb] mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">
                    Instagram
                  </p>
                  <a
                    href="mailto:contact@cyberanzen.org"
                    className="text-gray-400 hover:text-[#01ffdb] transition-colors text-xs sm:text-sm"
                  >
                    contact@instagram.org
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <div className="space-y-4">
            <div className="pt-2 sm:pt-4">
              <h4 className="text-white font-medium text-sm sm:text-base mb-1 sm:mb-2">
                Club President
              </h4>
              <p className="text-gray-400 text-xs sm:text-sm">Alex Morgan</p>
              <a
                href="mailto:president@cyberanzen.org"
                className="text-gray-400 hover:text-[#01ffdb] transition-colors flex items-center gap-1 mt-0.5 text-xs sm:text-sm"
              >
                president@cyberanzen.org{" "}
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>

            <div className="pt-2 sm:pt-4">
              <h4 className="text-white font-medium text-sm sm:text-base mb-1 sm:mb-2">
                Club Vice-President
              </h4>
              <p className="text-gray-400 text-xs sm:text-sm">Jafrin Sam</p>
              <a
                href="mailto:vicepresident@cyberanzen.org"
                className="text-gray-400 hover:text-[#01ffdb] transition-colors flex items-center gap-1 mt-0.5 text-xs sm:text-sm"
              >
                vicepresident@cyberanzen.org{" "}
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <motion.div
            className="space-y-4 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 relative">
              Stay Updated
              <span className="absolute bottom-0 left-0 w-10 sm:w-12 h-0.5 bg-[#01ffdb]"></span>
            </h3>
            <p className="text-gray-400 mb-2 sm:mb-4 text-sm sm:text-base">
              Subscribe to our newsletter for the latest updates on events,
              workshops, and cybersecurity news.
            </p>
            <div className="flex flex-col sm:h-11 sm:flex-row gap-2 sm:gap-0 md:w-full">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 text-gray-200 lg:min-w-[10vw] px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-1 focus:ring-[#01ffdb] w-full "
              />
              <motion.button
                className="cyber-button flex align-middle justify-center font-bold py-2 px-4 sm:px-6 rounded-lg md:w-full bg-[#01ffdb]/10 border border-[#01ffdb]/50 text-[#01ffdb] ml-0.5 sm:rounded-l  hover:bg-[#01ffdb]/20 text-xs"
                transition-all
                duration-300
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar with credits */}
      <div className="border-t border-gray-800 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="text-gray-500 text-xs sm:text-sm mb-3 md:mb-0">
              © 2025 CyberAnzen. All rights reserved.
            </div>
            <div className="text-gray-500 text-xs sm:text-sm">
              <p>
                Designed & Developed by{" "}
                <span className="text-[#01ffdb]">Vetrivel</span> &{" "}
                <span className="text-[#01ffdb]">Yogesh</span> &{" "}
                <span className="text-[#01ffdb]">Jafrin Sam</span> | II year
                2025
                <br className="md:hidden" />
                Department of Computer Science Cybersecurity
              </p>
            </div>
          </div>

          {/* Animated line */}
          <motion.div
            className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#01ffdb]/30 to-transparent mt-6 sm:mt-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>
      <div className="block md:hidden h-12" />
    </footer>
  );
};

export default React.memo(Footer);
