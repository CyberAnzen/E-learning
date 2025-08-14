import React, { useState } from "react";
import {
  Users,
  Settings,
  UserPlus,
  Copy,
  Mail,
  Crown,
  Shield,
  User,
  MoreVertical,
  Activity,
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";

export default function TeamDashboard() {
  const { team, leaveTeam, inviteMember, updateMemberRole, removeMember } =
    useAppContext();
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  if (!team) return null;

  const inputStyle =
    "w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#00bfff]/15 via-[#1e90ff]/10 to-[#00bfff]/5 border border-[#00bfff]/30 transition-all duration-300 text-white placeholder-[#00bfff]/50 outline-none focus:outline-none focus:ring-1 focus:ring-[#00bfff]";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(team.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      await inviteMember(inviteEmail);
      setInviteEmail("");
      setShowInviteForm(false);
    } catch (error) {
      console.error("Failed to invite member:", error);
    } finally {
      setIsInviting(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case "admin":
        return <Shield className="w-4 h-4 text-blue-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "owner":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "admin":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
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
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#00bfff]/20 to-[#1e90ff]/20 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-[#00ffff]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{team.name}</h1>
              <p className="text-[#00ffff]/60 mt-1">{team.description}</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-[#00ffff]/50">
                <span>{team.members.length} members</span>
                <span>
                  Created {new Date(team.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2 bg-[#00ffff]/5 border border-[#00ffff]/20 rounded-lg px-4 py-2">
              <span className="text-sm text-[#00ffff]/70">Code:</span>
              <code className="text-[#00ffff] font-mono">{team.code}</code>
              <button
                onClick={handleCopyCode}
                className="text-[#00ffff]/70 hover:text-[#00ffff] transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#00bfff] to-[#1e90ff] text-white px-4 py-2 rounded-lg hover:from-[#00bfff]/90 hover:to-[#1e90ff]/90 transition-all duration-300"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite</span>
            </button>
          </div>
        </div>

        {codeCopied && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">
              Team code copied to clipboard!
            </p>
          </div>
        )}

        {/* Invite Form */}
        {showInviteForm && (
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
        )}
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#00ffff]/60 text-sm">Total Members</p>
              <p className="text-2xl font-bold text-white">
                {team.members.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-[#00ffff]/50" />
          </div>
        </div>

        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#00ffff]/60 text-sm">Active Members</p>
              <p className="text-2xl font-bold text-white">
                {team.members.filter((m) => m.status === "active").length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-500/70" />
          </div>
        </div>

        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#00ffff]/60 text-sm">Pending Invites</p>
              <p className="text-2xl font-bold text-white">
                {team.members.filter((m) => m.status === "pending").length}
              </p>
            </div>
            <Mail className="w-8 h-8 text-yellow-500/70" />
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Team Members</h2>
          <span className="text-[#00ffff]/60 text-sm">
            {team.members.length} / {team.settings.maxMembers}
          </span>
        </div>

        <div className="space-y-4">
          {team.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-[#00ffff]/5 rounded-lg border border-[#00ffff]/10 hover:bg-[#00ffff]/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                      member.status
                    )} rounded-full border-2 border-[rgb(23,24,26)]`}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-white">{member.name}</h3>
                  <p className="text-sm text-[#00ffff]/50">{member.email}</p>
                  <p className="text-xs text-[#00ffff]/40">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
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

                <div className="relative">
                  <button
                    onClick={() =>
                      setSelectedMember(
                        selectedMember === member.id ? null : member.id
                      )
                    }
                    className="p-2 hover:bg-[#00ffff]/10 rounded-full transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-[#00ffff]/50" />
                  </button>

                  {selectedMember === member.id && (
                    <>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[rgb(23,24,26)] border border-[#00ffff]/25 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          {member.role !== "owner" && (
                            <button
                              onClick={() =>
                                updateMemberRole(member.id, "admin")
                              }
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#00ffff]/10"
                            >
                              Make Admin
                            </button>
                          )}
                          {member.role === "admin" && (
                            <button
                              onClick={() =>
                                updateMemberRole(member.id, "member")
                              }
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#00ffff]/10"
                            >
                              Remove Admin
                            </button>
                          )}
                          {member.role !== "owner" && (
                            <button
                              onClick={() => removeMember(member.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                            >
                              Remove Member
                            </button>
                          )}
                        </div>
                      </div>
                      <div
                        className="fixed inset-0 z-5"
                        onClick={() => setSelectedMember(null)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Actions */}
      <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Team Actions</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-[#00ffff]/30 rounded-lg text-[#00ffff]/70 hover:text-[#00ffff] hover:border-[#00ffff]/50 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Team Settings</span>
          </button>

          <button
            onClick={leaveTeam}
            className="flex items-center space-x-2 px-4 py-2 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 hover:border-red-500/50 transition-colors"
          >
            <span>Leave Team</span>
          </button>
        </div>
      </div>
    </div>
  );
}
