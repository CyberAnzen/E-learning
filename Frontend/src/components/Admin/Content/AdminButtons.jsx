import React from "react";
import { Trash2, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminButtons = ({ setShowDeleteConfirm, lessonId, classificationId }) => {
  const Navigate = useNavigate();
  return (
    <>
      {/*Admin Bin and Edit buttons*/}
      {/* Action buttons - positioned in top right */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          Navigate(`/lesson/update/${lessonId}`, {
            state: { ClassificationId: classificationId },
          });
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
    </>
  );
};

export default AdminButtons;
