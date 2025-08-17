import React from "react";
import { Settings } from "lucide-react";
import { useAppContext } from "../../../../context/AppContext";


export default function TeamActions({ team }) {
  const { leaveTeam } = useAppContext();

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam();
    } catch (error) {
      console.error("Failed to leave team:", error);
    }
  };

  return (
    <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Team Actions</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex items-center space-x-2 px-4 py-2 border border-[#00ffff]/30 rounded-lg text-[#00ffff]/70 hover:text-[#00ffff] hover:border-[#00ffff]/50 transition-colors">
          <Settings className="w-4 h-4" />
          <span>Team Settings</span>
        </button>

        <button
          onClick={handleLeaveTeam}
          className="flex items-center space-x-2 px-4 py-2 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 hover:border-red-500/50 transition-colors"
        >
          <span>Leave Team</span>
        </button>
      </div>
    </div>
  );
}