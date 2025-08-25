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

    // setIsSubmitting(true);
    // setErrorMessage("");

    try {
      // const response = await fetch(`${BACKEND_URL}/classification/create`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      retry();

      // if (!response.ok) {
      //   throw new Error(result.message || "Failed to create classification");
      // }

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
      // console.error(" API Error:", error.message);
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
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => {
              if (open) setOpen(false);
              else setIsAdd(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.section
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                duration: 0.2,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="relative bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 max-w-md w-full"
            >
              <form onSubmit={handleSubmit}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(!open);
                      }}
                      className="relative p-3 bg-gray-700/50 hover:bg-cyan-300/20 rounded-lg flex items-center justify-center"
                    >
                      <button
                        type="button"
                        className="w-6 h-6 text-cyan-400 flex items-center justify-center hover:text-cyan-300 rounded"
                      >
                        <selectedIcon.icon className="w-6 h-6" />
                      </button>

                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15, ease: "easeInOut" }}
                            className="absolute top-12 left-0 z-10 bg-gray-800 border border-gray-600 rounded shadow-lg p-1 space-y-1"
                          >
                            {icons.map((item, index) => (
                              <motion.button
                                key={index}
                                type="button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => {
                                  setSelectedIcon(item);
                                  setOpen(false);
                                  setFormData((prev) => ({
                                    ...prev,
                                    category: item.name,
                                  }));
                                }}
                                className="flex items-center gap-2 text-cyan-300 hover:bg-gray-700 px-2 py-1 rounded w-full"
                              >
                                <item.icon className="w-4 h-4" />
                                <span className="text-sm">{item.name}</span>
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-lg font-semibold text-white">0%</span>
                  </div>
                </div>

                <motion.input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Add Classification Title"
                  animate={
                    validationErrors.title ? { x: [-10, 10, -10, 10, 0] } : {}
                  }
                  transition={{ duration: 0.4 }}
                  className={`w-full text-xl font-semibold text-white mb-2 bg-transparent border-b focus:outline-none py-1 ${
                    validationErrors.title
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600 focus:border-cyan-500"
                  }`}
                />

                <motion.textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add The Description of the new Classification"
                  animate={
                    validationErrors.description
                      ? { x: [-10, 10, -10, 10, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                  className={`w-full text-gray-400 mb-4 bg-transparent border-b focus:outline-none py-1 resize-none min-h-[80px] ${
                    validationErrors.description
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600 focus:border-cyan-500"
                  }`}
                />

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 text-red-400 text-sm text-center"
                  >
                    {errorMessage}
                  </motion.div>
                )}

                <div className="mt-auto">
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `16%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Also Add lessons later
                    </span>
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder={selectedIcon.name}
                      className="text-cyan-400  bg-transparent border-b border-gray-600 focus:border-cyan-500 focus:outline-none w-32 text-right"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  whileHover={
                    !isSubmitting && !submitSuccess ? { scale: 1.03 } : {}
                  }
                  whileTap={
                    !isSubmitting && !submitSuccess ? { scale: 0.98 } : {}
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`cyber-button mt-6 w-full max-h-[7vh] flex items-center justify-center space-x-2 border border-[#01ffdb]/50 text-[#01ffdb] rounded-lg transition-all duration-300 ease-out ${
                    isSubmitting || submitSuccess
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-[#01ffdb]/10 hover:bg-[#01ffdb]/20"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"
                      />
                      <span>Creating...</span>
                    </>
                  ) : submitSuccess ? (
                    <>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        ✓
                      </motion.span>
                      <span>Success!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>Add Classification</span>
                    </>
                  )}
                </motion.button>

                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-center text-green-400 text-sm"
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
