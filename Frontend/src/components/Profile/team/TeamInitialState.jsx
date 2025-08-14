import React, { useState } from "react";
import { Users, Plus, UserPlus, Copy } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";

export default function TeamInitialState() {
  const { createTeam, joinTeam } = useAppContext();
  const [activeTab, setActiveTab] = useState("join");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    teamCode: "",
    teamName: "",
    teamDescription: "",
  });

  const inputStyle =
    "w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#00bfff]/15 via-[#1e90ff]/10 to-[#00bfff]/5 border border-[#00bfff]/30 transition-all duration-300 text-white placeholder-[#00bfff]/50 outline-none focus:outline-none focus:ring-1 focus:ring-[#00bfff] focus:border-[#00bfff]/50";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!formData.teamCode.trim()) {
      setError("Please enter a team code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await joinTeam(formData.teamCode);
    } catch (err) {
      setError("Invalid team code. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!formData.teamName.trim()) {
      setError("Please enter a team name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await createTeam({
        name: formData.teamName,
        description: formData.teamDescription,
      });
    } catch (err) {
      setError("Failed to create team. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const demoCode = "DEV2024";
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyDemo = () => {
    navigator.clipboard.writeText(demoCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#00bfff]/20 to-[#1e90ff]/20 rounded-full mb-6">
            <Users className="w-10 h-10 text-[#00ffff]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to TeamUp
          </h1>
          <p className="text-[#00ffff]/60 text-lg">
            Join an existing team or create your own to get started
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-black/30 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("join")}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-all duration-300 ${
              activeTab === "join"
                ? "bg-[#00ffff]/10 text-[#00ffff] shadow-sm"
                : "text-[#00ffff]/60 hover:text-[#00ffff]/80"
            }`}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Join Team
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-all duration-300 ${
              activeTab === "create"
                ? "bg-[#00ffff]/10 text-[#00ffff] shadow-sm"
                : "text-[#00ffff]/60 hover:text-[#00ffff]/80"
            }`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Team
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-8">
          {activeTab === "join" ? (
            <form onSubmit={handleJoinTeam} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#00ffff] mb-2">
                  Join Existing Team
                </h2>
                <p className="text-[#00ffff]/50 mb-6">
                  Enter the team code provided by your team leader
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#00ffff]/70 mb-2">
                      Team Code
                    </label>
                    <input
                      type="text"
                      name="teamCode"
                      value={formData.teamCode}
                      onChange={handleInputChange}
                      placeholder="Enter team code (e.g., DEV2024)"
                      className={inputStyle}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Demo code section */}
                  <div className="bg-[#00ffff]/5 border border-[#00ffff]/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#00ffff]/70 mb-1">
                          Demo Team Code:
                        </p>
                        <code className="text-[#00ffff] font-mono text-lg">
                          {demoCode}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyDemo}
                        className="flex items-center space-x-2 px-3 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 rounded-md transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">
                          {codeCopied ? "Copied!" : "Copy"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !formData.teamCode.trim()}
                className="w-full bg-gradient-to-r from-[#00bfff] to-[#1e90ff] text-white py-3 px-6 rounded-lg font-medium hover:from-[#00bfff]/90 hover:to-[#1e90ff]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? "Joining..." : "Join Team"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateTeam} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#00ffff] mb-2">
                  Create New Team
                </h2>
                <p className="text-[#00ffff]/50 mb-6">
                  Set up your team and invite members to collaborate
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#00ffff]/70 mb-2">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      placeholder="Enter team name"
                      className={inputStyle}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#00ffff]/70 mb-2">
                      Team Description (Optional)
                    </label>
                    <textarea
                      name="teamDescription"
                      value={formData.teamDescription}
                      onChange={handleInputChange}
                      placeholder="Describe your team's purpose and goals"
                      rows={3}
                      className={inputStyle}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !formData.teamName.trim()}
                className="w-full bg-gradient-to-r from-[#00bfff] to-[#1e90ff] text-white py-3 px-6 rounded-lg font-medium hover:from-[#00bfff]/90 hover:to-[#1e90ff]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? "Creating..." : "Create Team"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
