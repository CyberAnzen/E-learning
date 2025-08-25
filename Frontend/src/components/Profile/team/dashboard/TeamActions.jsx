import React, { useState } from "react";
import { Settings, Edit, Trash2, AlertTriangleIcon } from "lucide-react";
import { useAppContext } from "../../../../context/AppContext";
import DeleteModal from "../../../Admin/layout/DeleteModal";
import { motion, AnimatePresence } from "framer-motion";
import Usefetch from "../../../../hooks/Usefetch";

export default function TeamActions({ team }) {
  const { fetchTeam } = useAppContext();
  // console.log(team);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const [teamName, setTeamName] = useState(team?.teamName || "");
  const [description, setDescription] = useState(team?.description || "");

  const { retry: updateTeam, loading: updating } = Usefetch(
    "team/updateTeam",
    "patch",
    null,
    {},
    false
  );

  const { retry: deleteTeam } = Usefetch(
    "team/deleteTeam",
    "delete",
    null,
    {},
    false
  );

  const { retry: leaveTeamApi } = Usefetch(
    "team/leaveTeam",
    "post",
    null,
    {},
    false
  );

  const handleLeaveTeam = async () => {
    try {
      setIsLeaving(true);
      await leaveTeamApi(undefined, { data: { teamId: team?._id } });
      setShowLeaveConfirm(false);
      await fetchTeam();
    } catch (error) {
      console.error("Failed to leave team:", error);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTeam(undefined, {
        data: { teamId: team?._id },
      });
      setShowDeleteConfirm(false);
      await fetchTeam();
    } catch (error) {
      console.error("Failed to delete team:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (description.split(" ").length > 200) {
      alert("Description cannot exceed 200 words.");
      return;
    }
    try {
      await updateTeam(undefined, {
        data: { teamId: team?._id, teamName, description },
      });
      setShowEditModal(false);
      await fetchTeam();
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  };

  return (
    <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Team Actions</h2>
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <button
          onClick={() => setShowLeaveConfirm(true)}
          disabled={isLeaving}
          className="flex items-cente text-md space-x-2 px-4 py-2 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 hover:border-red-500/50 transition-colors disabled:opacity-50"
        >
          {team?.leader &&
            team?.teamMembers?.length === 1 &&
            team.teamMembers[0]._id === team.leader._id && (
              <span className="flex items-center space-x-2">
                <AlertTriangleIcon className="text-yellow-500" />{" "}
                <span>Delete &</span>
              </span>
            )}
          <span>{isLeaving ? "Leaving..." : "Leave Team"}</span>
        </button>

        {team?.leader && (
          <>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-green-500/30 rounded-lg text-green-400 hover:text-green-300 hover:border-green-500/50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Team</span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 hover:border-red-500/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Team</span>
            </button>
          </>
        )}
      </div>

      {team?.leader && (
        <DeleteModal
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
          modaltitle="Delete Team"
          message="Are you sure you want to delete this team? This action cannot be undone."
        />
      )}

      <DeleteModal
        showDeleteConfirm={showLeaveConfirm}
        setShowDeleteConfirm={setShowLeaveConfirm}
        isDeleting={isLeaving}
        handleDelete={handleLeaveTeam}
        modaltitle="Leave Team"
        message={
          team?.leader &&
          team?.teamMembers?.length === 1 &&
          team.teamMembers[0]._id === team.leader._id
            ? "You are the only member and also the leader. Leaving will delete the entire team permanently. Are you sure?"
            : "Are you sure you want to leave this team? This action cannot be undone."
        }
      />

      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative bg-cyan-800/40 p-6 rounded-xl border border-cyan-500/50 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Edit Team Details
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-cyan-500/50 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-cyan-500/50 text-white"
                    placeholder="Max 200 words"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-600/40 hover:bg-gray-500/50 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                  >
                    {updating ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
