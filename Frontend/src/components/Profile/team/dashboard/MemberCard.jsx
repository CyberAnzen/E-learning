import React, { useState } from "react";
import { Crown, User, MoreVertical } from "lucide-react";
import MemberActions from "./MemberActions";

export default function MemberCard({ member, isLeader }) {
  const [showActions, setShowActions] = useState(false);

  const getRoleIcon = (role) => {
    switch (role) {
      case "leader":
        return <Crown className="w-4 h-4 text-yellow-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "leader":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[#00ffff]/5 rounded-lg border border-[#00ffff]/10 hover:bg-[#00ffff]/10 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-[#00bfff] to-[#1e90ff] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {member.username?.charAt(0).toUpperCase() ||
                member.userDetails?.name?.charAt(0).toUpperCase() ||
                "U"}
            </span>
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
              member.status
            )} rounded-full border-2 border-[rgb(23,24,26)]`}
          />
        </div>
        <div>
          <h3 className="font-medium text-white">
            {member.userDetails?.name || member.username}
          </h3>
          <p className="text-sm text-[#00ffff]/50">{member.email}</p>
          {member.userDetails && (
            <p className="text-xs text-[#00ffff]/40">
              {member.userDetails.dept} • {member.userDetails.section} • Year{" "}
              {member.userDetails.year}
            </p>
          )}
          <p className="text-xs text-[#00ffff]/40">
            {member.status === "pending"
              ? `Invite sent • Code: ${member.inviteCode || "N/A"}`
              : `Joined ${new Date(member.joinedAt).toLocaleDateString()}`}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div
          className={`flex items-center space-x-1 px-3 py-1 rounded-full border text-xs ${getRoleBadgeColor(
            member.role
          )}`}
        >
          {getRoleIcon(member.role)}
          <span className="capitalize">{member.role}</span>
        </div>

        {/* Only show actions for active members */}
        {!isLeader && member.status !== "pending" && (
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-[#00ffff]/10 rounded-full transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-[#00ffff]/50" />
            </button>

            {showActions && (
              <MemberActions
                member={member}
                onClose={() => setShowActions(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
