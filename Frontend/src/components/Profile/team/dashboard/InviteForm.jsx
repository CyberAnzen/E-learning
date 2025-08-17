import React, { useState } from "react";
import { useAppContext } from "../../../../context/AppContext";



export default function InviteForm({ onClose }) {
  const { inviteMember } = useAppContext();
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const inputStyle =
    "w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#00bfff]/15 via-[#1e90ff]/10 to-[#00bfff]/5 border border-[#00bfff]/30 transition-all duration-300 text-white placeholder-[#00bfff]/50 outline-none focus:outline-none focus:ring-1 focus:ring-[#00bfff]";

  const handleInvite = async () => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      await inviteMember(inviteEmail);
      setInviteEmail("");
      onClose();
    } catch (error) {
      console.error("Failed to invite member:", error);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <form
      onSubmit={handleInvite}
      className="mt-6 p-4 bg-[#00ffff]/5 rounded-lg border border-[#00ffff]/20"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Enter email address"
          className={inputStyle + " flex-1"}
          disabled={isInviting}
        />
        <button
          type="submit"
          disabled={isInviting || !inviteEmail.trim()}
          className="bg-gradient-to-r from-[#00bfff] to-[#1e90ff] text-white px-6 py-3 rounded-lg hover:from-[#00bfff]/90 hover:to-[#1e90ff]/90 disabled:opacity-50 transition-all duration-300"
        >
          {isInviting ? "Sending..." : "Send Invite"}
        </button>
      </div>
    </form>
  );
}