import React, { useState } from "react";
import { Copy, Ban, Link } from "lucide-react";
import { useAppContext } from "../../../../context/AppContext";
import Usefetch from "../../../../hooks/Usefetch";

export default function InviteCard({ invite }) {
  const [copied, setCopied] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { team, fetchTeam } = useAppContext();

  const {
    retry,
    error: revokeError,
    loading: revokeLoading,
  } = Usefetch("team/revokeInvite", "post", null, {}, false);

  const handleCopy = () => {
    navigator.clipboard.writeText(invite.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/team/${team?._id}/invite/${invite?._id}/${invite.code}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async () => {
    setLocalError("");
    setIsRevoking(true);
    try {
      await retry(undefined, {
        data: {
          teamId: team?._id,
          memberId: invite.memberId._id,
        },
      });

      if (!revokeError) {
        setSuccessMsg("Invite revoked");
        await fetchTeam(); // refresh team data
        setTimeout(() => setSuccessMsg(""), 1200);
      } else {
        setLocalError(revokeError);
      }
    } catch (err) {
      setLocalError(err?.message || "Failed to revoke invite");
      console.error("Failed to revoke invite:", err);
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-[#fffb]/5 rounded-lg border border-[#00ffff]/10 hover:bg-[#00ffff]/10 transition-colors">
      {/* Top Row: User Info */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-[#00bfff] to-[#1e90ff] rounded-full flex items-center justify-center">
              {invite.memberId.userDetails?.name?.charAt(0).toUpperCase() ||
                invite.memberId.username?.charAt(0).toUpperCase() ||
                "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-[rgb(23,24,26)]" />
          </div>

          <div>
            <h3 className="font-medium text-white">
              {invite?.memberId?.username}
            </h3>
            <p className="text-sm text-[#00ffff]/50">{invite.memberId.email}</p>
            <p className="text-xs text-[#00ffff]/40">
              {invite.memberId.userDetails?.dept} •{" "}
              {invite.memberId.userDetails?.section} • Year{" "}
              {invite.memberId.userDetails?.year}
            </p>
          </div>
        </div>

        {/* Copy + Link */}
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xl text-[#00ffff]">
              {invite.code}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded-full hover:bg-[#00ffff]/10 transition-colors"
              title="Copy Code"
            >
              <Copy className="w-5 h-5 text-[#00ffff]" />
            </button>
          </div>
          {copied && (
            <span className="text-xs text-green-400 mt-1">Copied!</span>
          )}
        </div>
        {/* Revoke + Link */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          {/* Link button */}
          {/* <button
            onClick={handleCopyLink}
            className="p-2 rounded-full hover:bg-[#00ffff]/10 transition-colors"
            title="Copy Invite Link"
          >
            <Link className="w-4 h-4 text-[#00ffff]" />
          </button> */}

          {/* Revoke */}
          <button
            onClick={handleRevoke}
            disabled={isRevoking || revokeLoading}
            className="flex items-center space-x-1 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 disabled:opacity-50 transition-colors text-xs"
          >
            {isRevoking || revokeLoading ? (
              <span>Revoking...</span>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                <span>Revoke</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error + Success Feedback */}
      {localError && (
        <div className="text-sm text-red-400 bg-red-900/20 px-3 py-1 rounded">
          {localError}
        </div>
      )}
      {successMsg && (
        <div className="text-sm text-green-300 bg-green-900/10 px-3 py-1 rounded">
          {successMsg}
        </div>
      )}
    </div>
  );
}
