import React from "react";
import { Users, Activity, Mail } from "lucide-react";

export default function TeamStats({ team }) {
  const totalMembers = team.teamMembers?.length || 0;
  const activeMembers =
    team.teamMembers?.filter((m) => m.status === "active").length ||
    totalMembers;
  const totalInvites = team.invites?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#00ffff]/60 text-sm">Total Members</p>
            <p className="text-2xl font-bold text-white">{totalMembers}</p>
          </div>
          <Users className="w-8 h-8 text-[#00ffff]/50" />
        </div>
      </div>

      <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#00ffff]/60 text-sm">Active Members</p>
            <p className="text-2xl font-bold text-white">{activeMembers}</p>
          </div>
          <Activity className="w-8 h-8 text-green-500/70" />
        </div>
      </div>

      <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#00ffff]/60 text-sm">Pending Invites</p>
            <p className="text-2xl font-bold text-white">{totalInvites}</p>
          </div>
          <Mail className="w-8 h-8 text-yellow-500/70" />
        </div>
      </div>
    </div>
  );
}
