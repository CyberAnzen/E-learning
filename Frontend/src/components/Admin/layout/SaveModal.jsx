import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, SaveIcon } from "lucide-react";

const SaveModal = ({
  showSaveConfirm,
  setShowSaveConfirm,
  isSaving = false,
  handleSave,
  modaltitle = "Save Confirmation",
  message = "Are you sure you want to save this lesson? This action cannot be undone.",
}) => {
  // Freeze window scrolling when modal is open
  useEffect(() => {
    if (showSaveConfirm) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflow = "auto";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    // Cleanup to restore scrolling when component unmounts
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflow = "auto";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
  }, [showSaveConfirm]);

  return (
    <AnimatePresence>
      {showSaveConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          onClick={() => setShowSaveConfirm(false)}
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
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <SaveIcon className="w-6 h-6 text-cyan-300" />
              </div>
              <h3 className="text-2xl font-bold text-white">{modaltitle}</h3>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed">{message}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveConfirm(false)}
                disabled={isSaving}
                className="cyber-button max-h-[7vh] min-h-[7vh] flex-1 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/60 text-cyan-100 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center shadow-lg shadow-gray-500/10"
              >
                Cancel
              </button>

              <motion.button
                whileHover={!isSaving ? { scale: 1.02 } : {}}
                whileTap={!isSaving ? { scale: 0.98 } : {}}
                onClick={handleSave}
                disabled={isSaving}
                className="cyber-button max-h-[7vh] min-h-[7vh] flex-1 px-4 py-2 bg-emerald-500/80 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                {isSaving ? (
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
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

export default React.memo(SaveModal);
