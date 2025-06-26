import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Cpu,
  Terminal,
  BookOpen,
  Shield,
  Brain,
  Lightbulb,
  Network,
  Code,
  Book,
  Globe,
  Server,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Icon options for lesson classification
const icons = [
  { name: "Learning", icon: GraduationCap },
  { name: "Tech", icon: Cpu },
  { name: "Cybersecurity", icon: Shield },
  { name: "Coding", icon: Terminal },
  { name: "Knowledge", icon: BookOpen },
  { name: "Brain", icon: Brain },
  { name: "Ideas", icon: Lightbulb },
  { name: "Networks", icon: Network },
  { name: "Code", icon: Code },
  { name: "Books", icon: Book },
  { name: "Web", icon: Globe },
  { name: "Server", icon: Server },
  { name: "Security", icon: Lock },
];

// List of allowed icon names
const allowedIcons = icons.map((icon) => icon.name);

export const IconDropdown = ({ selectedIcon, onIconSelect, onFocus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleIconSelect = (icon) => {
    onIconSelect(icon.name); // Pass the icon name to the form
    setIsOpen(false);
  };

  // Find the selected icon data, default to first icon if invalid
  const selectedIconData = allowedIcons.includes(selectedIcon)
    ? icons.find((icon) => icon.name === selectedIcon)
    : icons[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          onFocus && onFocus();
        }}
        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10 flex items-center justify-between hover:bg-cyan-300/20"
      >
        <span>{selectedIconData.name}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl shadow-cyan-500/20 max-h-60 overflow-y-auto"
          >
            <div className="p-1 space-y-1">
              {icons.map((icon, index) => (
                <motion.button
                  key={icon.name}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleIconSelect(icon)}
                  className={`w-full flex items-center gap-2 text-cyan-300 hover:bg-gray-700 px-2 py-1 rounded transition-all ${
                    selectedIcon === icon.name
                      ? "bg-cyan-500/20 border border-cyan-500/50"
                      : ""
                  }`}
                >
                  <icon.icon className="w-4 h-4" />
                  <span className="text-sm">{icon.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
