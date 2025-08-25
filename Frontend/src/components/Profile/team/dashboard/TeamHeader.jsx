import React, { useState } from "react";
import { Users, UserPlus, Copy } from "lucide-react";
import InviteForm from "./InviteForm";

export default function TeamHeader({ team }) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(team.teamCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-[#00bfff]/20 to-[#1e90ff]/20 rounded-xl flex items-center justify-center">
            <Users className="w-8 h-8 text-[#00ffff]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{team.teamName}</h1>
            <p className="text-[#00ffff]/60 mt-1">{team.description}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-[#00ffff]/50">
              <span>{team.teamMembers?.length || 0} members</span>
              <span>
                Created {new Date(team.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {team?.leader && (
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#00bfff] to-[#1e90ff] text-white px-4 py-2 rounded-lg hover:from-[#00bfff]/90 hover:to-[#1e90ff]/90 transition-all duration-300"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite</span>
            </button>
          )}
          <div className="flex items-center space-x-2 bg-[#00ffff]/5 border border-[#00ffff]/20 rounded-lg px-4 py-2">
            <span className="text-sm text-[#00ffff]/70">Team Code:</span>
            <code className="text-[#00ffff] font-mono">{team.teamCode}</code>
            <button
              onClick={handleCopyCode}
              className="text-[#00ffff]/70 hover:text-[#00ffff] transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {codeCopied && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-sm">
            Team code copied to clipboard!
          </p>
        </div>
      )}

      {showInviteForm && (
        <InviteForm onClose={() => setShowInviteForm(false)} />
      )}
    </div>
  );
}
