import React, { useState } from "react";
import { User, Copy, XCircle, Ban, Link } from "lucide-react";

export default function InviteCard({ invite, onCancel, onRevoke }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(invite.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[#fffb]/5 rounded-lg border border-[#00ffff]/10 hover:bg-[#00ffff]/10 transition-colors">
      {/* Left side: user avatar + details */}
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
            {invite.memberId.userDetails?.name || invite.memberId.username}
          </h3>
          <p className="text-sm text-[#00ffff]/50">{invite.memberId.email}</p>
          <p className="text-xs text-[#00ffff]/40">
            {invite.memberId.userDetails?.dept} •{" "}
            {invite.memberId.userDetails?.section} • Year{" "}
            {invite.memberId.userDetails?.year}
          </p>
        </div>
      </div>

      {/* Middle: Invite Code (centered) */}
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
        {copied && <span className="text-xs text-green-400 mt-1">Copied!</span>}
      </div>

      {/* Right side: actions */}
      <div className="flex items-center space-x-2 flex-1 justify-end">
        {/* Link button */}
        <button
          onClick={() => alert(`Invite link: ${invite.code}`)}
          className="p-2 rounded-full hover:bg-[#00ffff]/10 transition-colors"
          title="Copy Invite Link"
        >
          <Link className="w-4 h-4 text-[#00ffff]" />
        </button>

        {/* Cancel Invite */}
        <button
          onClick={() => onCancel(invite)}
          className="flex items-center space-x-1 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-xs"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancel</span>
        </button>

        {/* Revoke Invite */}
        <button
          onClick={() => onRevoke(invite)}
          className="flex items-center space-x-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition-colors text-xs"
        >
          <Ban className="w-4 h-4" />
          <span>Revoke</span>
        </button>
      </div>
    </div>
  );
}
