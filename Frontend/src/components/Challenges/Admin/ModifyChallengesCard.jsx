import React, { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Usefetch from "../../../hooks/Usefetch";
import { Link } from "react-router-dom";
import DeleteModal from "../../Admin/layout/DeleteModal";

const ModifyChallenges = ({ challenge, onchallengeClick, handleRetry }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete request
  const { Data: DeleteResult, retry: DeleteRetry } = Usefetch(
    `classification/delete/${challenge.id}`,
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
  //bg-gradient-to-br from-green-900/90 to-green-700/40 border border-green-500/40 rounded-2xl shadow-[0_0_15px_rgba(0,255,0,0.3)]
  return (
    <>
      <div
        className=" group relative flex flex-col min-h-[200px] sm:min-h-[250px] md:min-h-[300px] bg-green-500/5 backdrop-blur-xl p-6 rounded-xl border border-green-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer "
        onClick={() => {
          if (!showDeleteConfirm) onchallengeClick(challenge._id);
        }}
      >
        <div className="absolute -z-10 inset-0 bg-gradient-to-br from-black/40 to-green-900/20 backdrop-blur-xl rounded-2xl" />

        {/* Action buttons - positioned at top center */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Link to={`/challenge/edit/${challenge._id}`}>
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
            className="p-2 h- bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/50 transition-all duration-200"
            aria-label="Delete Challenges"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </motion.button>
        </div>

        {/* Header with icon and progress */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex justify-center items-center w-10 h-10 bg-green-800/50 rounded-full">
            <div className=" text-green-400">
              {!challenge.challengeNumber && (
                <h3 className="w-5 h-5  text-2xl">-</h3>
              )}
              {challenge?.challengeNumber && (
                <h3 className="">{challenge.challengeNumber}</h3>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-green-300">Score</span>
            <span className="text-lg font-semibold text-white">
              {!challenge.score && (
                <h3 className="w-5 h-5 flex justify-center items-center text-2xl">
                  -
                </h3>
              )}
              {challenge?.score && <h3 className="">{challenge?.score}</h3>}
            </span>
          </div>
         <div className="flex flex-col items-end">
  <span className="text-sm text-green-300">Difficulty</span>
  <span
    className={`text-sm font-semibold text-white rounded-4xl p-1.5 mt-1 backdrop-blur-sm ${
      challenge.difficulty?.toLowerCase() === "easy"
        ? "bg-gradient-to-r from-green-400/40 to-green-600/40 border border-green-500/60"
        : challenge.difficulty?.toLowerCase() === "intermediate"
        ? "bg-gradient-to-r from-yellow-400/40 to-yellow-600/40 border border-yellow-500/60"
        : challenge.difficulty?.toLowerCase() === "hard"
        ? "bg-gradient-to-r from-red-500/40 to-red-700/40 border border-red-600/60"
        : challenge.difficulty?.toLowerCase() === "advanced"
        ? "bg-gradient-to-r from-purple-500/40 to-purple-700/40 border border-purple-600/60"
        : "bg-gradient-to-r from-amber-500/40 to-amber-700/40 border border-amber-600/60"
    }`}
  >
    {!challenge.difficulty ? (
      <h3 className="w-5 h-5 flex justify-center items-center text-2xl">-</h3>
    ) : (
      <h3>
        {challenge.difficulty.charAt(0).toUpperCase() +
          challenge.difficulty.slice(1).toLowerCase()}
      </h3>
    )}
  </span>
</div>

        </div>

        {/* challenge title and description */}
        <h2 className="text-xl font-semibold text-white mb-2 -mt-4 line-clamp-2">
          {challenge?.title}
        </h2>

        <p className="text-green-300 mb-4 line-clamp-3">
          {challenge?.description}
        </p>

        <div className="mt-auto flex justify-end text-sm">
          <span className="text-green-400">{challenge?.category}</span>
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
            <span className="font-semibold text-white">{challenge?.title}</span>
            ? This action{" "}
            <span className="font-semibold text-red-400">cannot</span> be
            undone.
          </div>
        }
      />
    </>
  );
};

export default ModifyChallenges;
