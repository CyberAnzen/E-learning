import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";

const DeleteModal = ({
  showDeleteConfirm,
  setShowDeleteConfirm,
  isDeleting = false,
  handleDelete,
  modaltitle = "Delete Confirmation",
  message = "Deletion Cannot be Undone. Press delete to delete permenantly",
}) => {
  return (
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
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">{modaltitle} </h3>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed">{message}</p>

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
  );
};

export default React.memo(DeleteModal);
