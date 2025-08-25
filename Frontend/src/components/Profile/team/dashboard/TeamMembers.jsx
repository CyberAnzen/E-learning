import React from "react";
import { Users } from "lucide-react";
import MemberCard from "./MemberCard";
import InviteCard from "./InviteCard";
import RefreshButton from "../ui/Refreshbutton";
export default function TeamMembers({ team }) {
  const teamMembers = team.teamMembers || [];
  const teamLeader = team.teamLeader;

  // Filter out leader if they are inside teamMembers too
  const filteredMembers = teamLeader
    ? teamMembers.filter((m) => m.userId._id !== teamLeader._id)
    : teamMembers;

  return (
    <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Team Members</h2>
        <div className="flex items-center space-x-1.5">
          <RefreshButton />
          <span className="text-[#00ffff]/60 text-sm">
            {filteredMembers.length + (teamLeader ? 1 : 0)} Members
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Team Leader */}
        {teamLeader && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#00ffff] mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Team Leader
            </h3>
            <MemberCard
              member={{
                ...teamLeader,
                role: "Admin",
                status: "active",
                joinedAt: team.createdAt,
              }}
              isLeader={true}
            />
          </div>
        )}

        {/* Team Members */}
        {filteredMembers.length > 0 ? (
          <div>
            <h3 className="text-lg font-medium text-[#00ffff] mb-3">
              Members ({filteredMembers.length})
            </h3>
            <div className="space-y-3">
              {filteredMembers.map((member) => (
                <MemberCard
                  key={member.userId._id}
                  member={{
                    ...member.userId,
                    joinedAt: member.timestamp,
                    role: "member",
                    status: "active",
                  }}
                  isLeader={false}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-[#00ffff]/30 mx-auto mb-4" />
            <p className="text-[#00ffff]/60">No team members yet</p>
            <p className="text-[#00ffff]/40 text-sm mt-2">
              Invite members to join your team
            </p>
          </div>
        )}
        {team.invites?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-[#00ffff] mb-3">
              Pending Invites ({team.invites.length})
            </h3>
            <div className="space-y-3">
              {team.invites.map((invite) => (
                <InviteCard
                  key={invite._id}
                  invite={invite}
                  onCancel={(inv) => console.log("Cancel Invite:", inv)}
                  onRevoke={(inv) => console.log("Revoke Invite:", inv)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
