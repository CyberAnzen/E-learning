import React from "react";
import { useAppContext } from "../../../../context/AppContext";



export default function MemberActions({ member, onClose }) {
  const { updateMemberRole, removeMember } = useAppContext();

  const handleUpdateRole = async (newRole) => {
    try {
      await updateMemberRole(member.id, newRole);
      onClose();
    } catch (error) {
      console.error("Failed to update member role:", error);
    }
  };

  const handleRemoveMember = async () => {
    try {
      await removeMember(member.id);
      onClose();
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  return (
    <>
      <div className="absolute right-0 top-full mt-2 w-48 bg-[rgb(23,24,26)] border border-[#00ffff]/25 rounded-lg shadow-lg z-10">
        <div className="py-1">
          {member.role !== "leader" && (
            <button
              onClick={() => handleUpdateRole("admin")}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#00ffff]/10"
            >
              Make Admin
            </button>
          )}
          {member.role === "admin" && (
            <button
              onClick={() => handleUpdateRole("member")}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#00ffff]/10"
            >
              Remove Admin
            </button>
          )}
          {member.role !== "leader" && (
            <button
              onClick={handleRemoveMember}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              Remove Member
            </button>
          )}
        </div>
      </div>
      <div
        className="fixed inset-0 z-5"
        onClick={onClose}
      />
    </>
  );
}