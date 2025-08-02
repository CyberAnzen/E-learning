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
  Lock,
  Edit3,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import Usefetch from "../../../hooks/Usefetch";
import { Link } from "react-router-dom";
import DeleteModal from "../../Admin/layout/DeleteModal";
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

const MdodifyChallenges = ({ course, onCourseClick, handleRetry }) => {
  const Icon = iconMap[course.icon] || Code;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete request
  const { Data: DeleteResult, retry: DeleteRetry } = Usefetch(
    `classification/delete/${course.id}`,
    "delete",
    { data: null },
    {},
    false
  );

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      DeleteRetry();

      if (!DeleteResult) {
        throw new Error("Failed to delete challenge");
      }

      setShowDeleteConfirm(false);
      setIsDeleting(false);
      handleRetry();
    } catch (error) {
      console.error("Delete API Error:", error.message);
      setIsDeleting(false);
    }
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    if (showDeleteConfirm) {
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
  }, [showDeleteConfirm]);

  return (
    <>
      <div
        className=" group relative flex flex-col min-h-[200px] sm:min-h-[250px] md:min-h-[300px] bg-green-900/20 backdrop-blur-xl p-6 rounded-xl border border-green-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer"
        onClick={() => {
          if (!showDeleteConfirm) onCourseClick(course.id);
        }}
      >
        {/* Action buttons - positioned at top center */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Link to={`/edit-Challenges/${course.id}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg border border-green-500/50 transition-all duration-200"
              aria-label="Edit Challenges"
            >
              <Edit3 className="w-4 h-4 text-green-400" />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/50 transition-all duration-200"
            aria-label="Delete Challenges"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </motion.button>
        </div>

        {/* Header with icon and progress */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-green-800/50 rounded-lg">
            <Icon className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-green-300">Difficulty</span>
            <span className="text-lg font-semibold text-white">
              {course.progress}%
            </span>
          </div>
        </div>

        {/* Course title and description */}
        <h2 className="text-xl font-semibold text-white mb-2 truncate">
          {course.title}
        </h2>
        <p className="text-green-300 mb-4 line-clamp-3">{course.description}</p>

        <div className="mt-auto flex justify-end text-sm">
          <span className="text-green-400">{course.category}</span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-green-500/10 rounded-xl pointer-events-none" />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
        modaltitle="Delete Challenge"
        message={
          <div>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">{course?.title}</span>?
            This action{" "}
            <span className="font-semibold text-red-400">cannot</span> be
            undone.
          </div>
        }
      />
    </>
  );
};

export default MdodifyChallenges;
