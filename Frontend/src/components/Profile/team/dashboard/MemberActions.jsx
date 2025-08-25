import React, { useState } from "react";
import { useAppContext } from "../../../../context/AppContext";
import Usefetch from "../../../../hooks/Usefetch";
import DeleteModal from "../../../Admin/layout/DeleteModal";

export default function MemberActions({ member, onClose }) {
  const { fetchTeam, team } = useAppContext();

  const { retry: updateAdminApi, loading: updatingAdmin } = Usefetch(
    "team/changeLeader", 
    "put",
    null,
    {},
    false
  );

  const { retry: removeMemberApi, loading: removingMember } = Usefetch(
    "team/removeMember",
    "delete",
    null,
    {},
    false
  );

  // state
  const [showConfirmAdmin, setShowConfirmAdmin] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [isProcessingAdmin, setIsProcessingAdmin] = useState(false);
  const [isProcessingRemove, setIsProcessingRemove] = useState(false);

  // assign single admin
  const assignAdmin = async (memberId) => {
    try {
      let teamId = team?._id || team?.id || null;

      if (!teamId) {
        const fetched = await fetchTeam();
        teamId = fetched?._id || fetched?.id || null;
      }
      if (!teamId) throw new Error("Unable to resolve teamId");

      // overwrite admin directly — backend ensures only one admin exists
      await updateAdminApi(undefined, {
        data: { teamId: String(teamId), newLeaderId: String(memberId) },
      });

      await fetchTeam();
    } catch (err) {
      throw err;
    }
  };

  const removeMember = async (memberId) => {
    try {
      let teamId = team?._id || team?.id || null;
      if (!teamId) {
        const fetched = await fetchTeam();
        teamId = fetched?._id || fetched?.id || null;
      }
      if (!teamId) throw new Error("Unable to resolve teamId");

      await removeMemberApi(undefined, {
        data: { memberId: String(memberId), teamId: String(teamId) },
      });

      await fetchTeam();
    } catch (err) {
      throw err;
    }
  };

  const confirmAssignAdmin = async () => {
    setIsProcessingAdmin(true);
    try {
      await assignAdmin(member?._id);
      setShowConfirmAdmin(false);
      onClose();
    } catch (error) {
      console.error("Failed to assign admin:", error);
    } finally {
      setIsProcessingAdmin(false);
    }
  };

  const confirmRemoveMember = async () => {
    setIsProcessingRemove(true);
    try {
      await removeMember(member?._id);
      setShowConfirmRemove(false);
      onClose();
    } catch (error) {
      console.error("Failed to remove member:", error);
    } finally {
      setIsProcessingRemove(false);
    }
  };

  return (
    <>
      <div className="absolute right-0 top-full mt-2 w-48 bg-[rgb(23,24,26)] border border-[#00ffff]/25 rounded-lg shadow-lg z-10">
        <div className="py-1">
          {member.role !== "leader" && (
            <button
              onClick={() => setShowConfirmAdmin(true)}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#00ffff]/10"
            >
              Make Admin
            </button>
          )}
          {member.role !== "leader" && (
            <button
              onClick={() => setShowConfirmRemove(true)}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              Remove Member
            </button>
          )}
        </div>
      </div>

      {/* Confirm Make Admin */}
      <DeleteModal
        showDeleteConfirm={showConfirmAdmin}
        setShowDeleteConfirm={setShowConfirmAdmin}
        isDeleting={isProcessingAdmin || updatingAdmin}
        handleDelete={confirmAssignAdmin}
        modaltitle={`Make ${member?.username} Admin`}
        message={
          <>
            This will make{" "}
            <span className="text-cyan-400 font-bold">{member?.username}</span>{" "}
            the <span className="text-cyan-400 font-bold">only admin</span> of
            the team (any existing admin will lose access). Proceed?
          </>
        }
      />

      {/* Confirm Remove Member */}
      <DeleteModal
        showDeleteConfirm={showConfirmRemove}
        setShowDeleteConfirm={setShowConfirmRemove}
        isDeleting={isProcessingRemove || removingMember}
        handleDelete={confirmRemoveMember}
        modaltitle={`Remove Member`}
        message={
          <>
            Are you sure you want to remove{" "}
            <span className="text-red-500 font-bold">{member?.username}</span>{" "}
            from the team? This action cannot be undone.
          </>
        }
      />

      <div className="fixed inset-0 z-5" onClick={onClose} />
    </>
  );
}
