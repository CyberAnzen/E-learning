import React, { useState, useEffect } from "react";
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
  Trash2,
  Edit3,
  X,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Icon mapping for course icons
const iconMap = {
  Learning: GraduationCap,
  Tech: Cpu,
  Cybersecurity: Shield,
  Coding: Terminal,
  Knowledge: BookOpen,
  Brain: Brain,
  Ideas: Lightbulb,
  Networks: Network,
  Code: Code,
  Books: Book,
  Web: Globe,
  Server: Server,
  Security: Lock,
  Bulb: Brain,
};

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

/**
 * Individual course card component
 * Displays course information with interactive hover effects, delete and edit functionality
 */
const MdodifyClassification = ({ course, onCourseClick, handleRetry }) => {
  const Icon = iconMap[course.icon] || Code;

  // State management
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(
    icons.find((icon) => icon.name === course.icon) || icons[0]
  );
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: course.title || "",
    description: course.description || "",
    category: course.category || "",
  });
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    description: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  // Handle form input changes for edit
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

  // Handle delete confirmation
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/classification/delete/${course.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete classification");
      }

      // Close modal and trigger refresh
      setShowDeleteConfirm(false);
      setIsDeleting(false);
      handleRetry();
    } catch (error) {
      console.error("Delete API Error:", error.message);
      setIsDeleting(false);
      // You might want to show an error message to the user
    }
  };

  // Handle edit submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    setIsEditing(true);
    setErrorMessage("");

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      icon: selectedIcon.name,
      category: formData.category || selectedIcon.name,
    };

    try {
      const response = await fetch(
        `${BACKEND_URL}/classification/update/${course.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update classification");
      }

      // Show success state
      setEditSuccess(true);
      setIsEditing(false);

      // Wait briefly before closing the modal
      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccess(false);
        setValidationErrors({ title: false, description: false });
        setErrorMessage("");
        handleRetry();
      }, 400);
    } catch (error) {
      console.error("Edit API Error:", error.message);
      setIsEditing(false);
      setErrorMessage(error.message || "Failed to update classification");
    }
  };

  // Reset form when opening edit modal
  const openEditModal = () => {
    setFormData({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
    });
    setSelectedIcon(
      icons.find((icon) => icon.name === course.icon) || icons[0]
    );
    setShowEditModal(true);
    setValidationErrors({ title: false, description: false });
    setErrorMessage("");
    setEditSuccess(false);
  };

  // Handle card click for course navigation
  const handleCardClick = (e) => {
    // Only trigger onCourseClick if no modals are open and click is not on action buttons
    if (!showDeleteConfirm && !showEditModal && onCourseClick) {
      onCourseClick(course.id);
    }
  };

  // Prevent scroll when modals are open
  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    if (showEditModal || showDeleteConfirm) {
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
  }, [showEditModal, showDeleteConfirm]);

  return (
    <>
      <div
        className="group relative bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Action buttons - positioned in top right */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              openEditModal();
            }}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/50 transition-all duration-200"
            aria-label="Edit classification"
          >
            <Edit3 className="w-4 h-4 text-blue-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/50 transition-all duration-200"
            aria-label="Delete classification"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </motion.button>
        </div>

        {/* Header with icon and progress */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gray-700/50 rounded-lg">
            <Icon className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-lg font-semibold text-white">
              {course.progress}%
            </span>
          </div>
        </div>

        {/* Course title and description */}
        <h2 className="text-xl font-semibold text-white mb-2">
          {course.title}
        </h2>
        <p className="text-gray-400 mb-4">{course.description}</p>

        {/* Progress bar and stats */}
        <div className="mt-auto">
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">
              {course.completedLessons} of {course.totalLessons} lessons
            </span>
            <span className="text-cyan-400">{course.category}</span>
          </div>
        </div>

        {/* Hover overlay for continue learning */}
        <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-cyan-500/10 rounded-xl pointer-events-none">
          {/* <span className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg backdrop-blur-sm">
            Click to continue learning
          </span> */}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => setShowDeleteConfirm(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                duration: 0.2,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-cyan-800/40 p-6 rounded-xl border border-cyan-500/50 max-w-md w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Delete Classification
                </h3>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{course.title}"? This action
                cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="cyber-button max-h-[7vh] min-h-[7vh] flex-1 px-4 py-2 bg-gray-600/40 hover:bg-gray-500/50 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={!isDeleting ? { scale: 1.02 } : {}}
                  whileTap={!isDeleting ? { scale: 0.98 } : {}}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="cyber-button max-h-[7vh] min-h-[7vh] flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => {
              if (iconDropdownOpen) setIconDropdownOpen(false);
              else setShowEditModal(false);
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
                setIconDropdownOpen(false);
              }}
              className="relative bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 max-w-md w-full mx-4"
            >
              <form onSubmit={handleEditSubmit}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIconDropdownOpen(!iconDropdownOpen);
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
                        {iconDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15, ease: "easeInOut" }}
                            className="absolute top-12 left-0 z-10 bg-gray-800 border border-gray-600 rounded shadow-lg p-1 space-y-1 max-h-48 overflow-y-auto"
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
                                  setIconDropdownOpen(false);
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
                    <span className="text-lg font-semibold text-white">
                      {course.progress}%
                    </span>
                  </div>
                </div>

                <motion.input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Classification Title"
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
                  placeholder="Classification Description"
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
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {course.completedLessons} of {course.totalLessons} lessons
                    </span>
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder={selectedIcon.name}
                      className="text-cyan-400 text-end bg-transparent border-b border-gray-600 focus:border-cyan-500 focus:outline-none w-32 text-right"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isEditing || editSuccess}
                  whileHover={!isEditing && !editSuccess ? { scale: 1.03 } : {}}
                  whileTap={!isEditing && !editSuccess ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`cyber-button mt-6 w-full max-h-[7vh] flex items-center justify-center space-x-2 border border-[#01ffdb]/50 text-[#01ffdb] rounded-lg transition-all duration-300 ease-out ${
                    isEditing || editSuccess
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-[#01ffdb]/10 hover:bg-[#01ffdb]/20"
                  }`}
                >
                  {isEditing ? (
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
                      <span>Updating...</span>
                    </>
                  ) : editSuccess ? (
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
                      <Edit3 size={18} />
                      <span>Update Classification</span>
                    </>
                  )}
                </motion.button>

                {editSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-center text-green-400 text-sm"
                  >
                    Classification updated successfully!
                  </motion.div>
                )}
              </form>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MdodifyClassification;
