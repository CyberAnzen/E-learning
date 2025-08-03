import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  Cpu,
  Shield,
  Terminal,
  BookOpen,
  Brain,
  Lightbulb,
  Network,
  Code,
  Book,
  Globe,
  Server,
  Plus,
  Lock,
  ChevronDown,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Usefetch from "../../../hooks/Usefetch";

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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddCourse = ({ handleRetry }) => {
  const [isAdd, setIsAdd] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    description: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }

    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateForm = () => {
    const errors = {
      title: !formData.title.trim(),
      description: !formData.description.trim(),
    };

    setValidationErrors(errors);
    return !errors.title && !errors.description;
  };

  // Post request of the form submission
  const payload = {
    title: formData.title.trim(),
    description: formData.description.trim(),
    category: formData.category || selectedIcon.name,
    icon: selectedIcon.name,
  };

  const {
    Data: result,
    error,
    loading,
    retry,
  } = Usefetch(
    "classification/create",
    "post",
    JSON.stringify(payload),
    {},
    false
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    try {
      retry();

      console.log(" API response:", result);

      // Show success state
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Wait briefly before closing the modal
      setTimeout(() => {
        setIsAdd(false);

        // Reset form state
        setFormData({ title: "", description: "", category: "" });
        setSelectedIcon(icons[0]);
        setSubmitSuccess(false);
        setValidationErrors({ title: false, description: false });
        setErrorMessage("");
        handleRetry();
      }, 400);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(error.message || "Failed to create classification");
    }
  };

  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    if (isAdd) {
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", preventScroll, { passive: false });
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("touchmove", preventScroll);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [isAdd]);

  return (
    <>
      <AnimatePresence>
        {isAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => {
              if (open) setOpen(false);
              else setIsAdd(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.section
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 shadow-2xl shadow-black/50 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsAdd(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              >
                <X size={20} />
              </button>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">
                    Add New Classification
                  </h2>
                  <p className="text-gray-400">
                    Create a new learning classification
                  </p>
                </div>

                {/* Icon Selection and Progress */}
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Category Icon
                    </label>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(!open);
                      }}
                      className="relative"
                    >
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 hover:border-cyan-500/50 rounded-xl transition-all duration-200 min-w-[140px]"
                      >
                        <selectedIcon.icon className="w-5 h-5 text-cyan-400" />
                        <span className="text-white font-medium">
                          {selectedIcon.name}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </motion.button>

                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 mt-2 z-20 bg-gray-800/95 backdrop-blur-xl border border-gray-600 rounded-xl shadow-2xl p-2 min-w-[200px] max-h-60 overflow-y-auto"
                          >
                            <div className="grid grid-cols-1 gap-1">
                              {icons.map((item, index) => (
                                <motion.button
                                  key={index}
                                  type="button"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.02 }}
                                  onClick={() => {
                                    setSelectedIcon(item);
                                    setOpen(false);
                                    setFormData((prev) => ({
                                      ...prev,
                                      category: item.name,
                                    }));
                                  }}
                                  className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2.5 rounded-lg transition-all duration-150 text-left"
                                >
                                  <item.icon className="w-4 h-4 text-cyan-400" />
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Progress
                    </label>
                    <div className="text-2xl font-bold text-white">0%</div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  {/* Title Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-300"
                    >
                      Classification Title *
                    </label>
                    <motion.input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter classification title"
                      animate={
                        validationErrors.title ? { x: [-8, 8, -8, 8, 0] } : {}
                      }
                      transition={{ duration: 0.4 }}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        validationErrors.title
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-600 focus:border-cyan-500 focus:ring-cyan-500/20"
                      }`}
                    />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-300"
                    >
                      Description *
                    </label>
                    <motion.textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your classification"
                      rows={4}
                      animate={
                        validationErrors.description
                          ? { x: [-8, 8, -8, 8, 0] }
                          : {}
                      }
                      transition={{ duration: 0.4 }}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                        validationErrors.description
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-600 focus:border-cyan-500 focus:ring-cyan-500/20"
                      }`}
                    />
                  </div>

                  {/* Category Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="category"
                      className="text-sm font-medium text-gray-300"
                    >
                      Custom Category (Optional)
                    </label>
                    <input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder={selectedIcon.name}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "16%" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Add lessons later</span>
                    <span className="text-cyan-400 font-medium">
                      {formData.category || selectedIcon.name}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
                  >
                    {errorMessage}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  whileHover={
                    !isSubmitting && !submitSuccess ? { scale: 1.02 } : {}
                  }
                  whileTap={
                    !isSubmitting && !submitSuccess ? { scale: 0.98 } : {}
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                    isSubmitting || submitSuccess
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Creating...</span>
                    </>
                  ) : submitSuccess ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
                      >
                        ✓
                      </motion.div>
                      <span>Success!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      <span>Add Classification</span>
                    </>
                  )}
                </motion.button>

                {/* Success Message */}
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-400 font-medium"
                  >
                    Classification added successfully!
                  </motion.div>
                )}
              </form>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Card before clicking */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-cyan-500/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-gray-900/60 backdrop-blur-2xl border border-gray-400/20 rounded-2xl z-0" />

        <div
          className={`${
            hover ? "blur-sm" : "blur-none"
          } relative z-10 flex flex-col h-full space-y-6 transition-all duration-300`}
        >
          <div className="flex items-start justify-between">
            <div className="p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30">
              <Code className="w-7 h-7 text-cyan-400" />
            </div>
            <div className="text-right space-y-1">
              <span className="text-sm text-gray-400 font-medium">
                Progress
              </span>
              <span className="text-2xl font-bold text-white">NA%</span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white leading-tight">
              Add Classification Title
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Add The Description of the new Classification
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="w-full bg-gray-700/50 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `16%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-medium">
                none of none lessons
              </span>
              <span className="text-cyan-400 font-semibold">Security</span>
            </div>
          </div>
        </div>

        <motion.button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            setIsAdd(true);
            // Reset form when reopening
            setFormData({ title: "", description: "", category: "" });
            setSelectedIcon(icons[0]);
            setValidationErrors({ title: false, description: false });
            setErrorMessage("");
            setSubmitSuccess(false);
          }}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out backdrop-blur-xl rounded-2xl z-20 cursor-pointer ${
            hover
              ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
              : "bg-transparent"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            className={`${
              !hover
                ? "bg-gray-800/80"
                : "bg-gradient-to-br from-cyan-500/80 to-blue-500/80"
            } p-6 backdrop-blur-md text-white rounded-2xl transform transition-all duration-300 shadow-lg ${
              hover ? "shadow-cyan-500/25" : "shadow-black/25"
            }`}
          >
            <Plus
              size={32}
              className={hover ? "text-white" : "text-cyan-400"}
            />
          </motion.div>
        </motion.button>
      </motion.div>
    </>
  );
};

export default AddCourse;
