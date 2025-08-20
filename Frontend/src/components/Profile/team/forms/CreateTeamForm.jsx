import React, { useState, useEffect } from "react";
import Usefetch from "../../../../hooks/Usefetch";
import FormInput from "../ui/FormInput";
import FormTextarea from "../ui/FormTextarea";
import ErrorMessage from "../ui/ErrorMessage";
import SuccessMessage from "../ui/SuccessMessage";
import SubmitButton from "../ui/SubmitButton";

export default function CreateTeamForm() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    teamName: "",
    teamDescription: "",
  });

  // Use Usefetch hook for creating team - don't auto-trigger
  const {
    Data: createTeamData,
    error: createTeamError,
    loading: createTeamLoading,
    retry: createTeamAPI,
  } = Usefetch("team/createTeam", "post", null, {}, false);

  const handleInputChange = () => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleCreateTeam = async () => {
    e.preventDefault();
    if (!formData.teamName.trim()) {
      setError("Please enter a team name");
      return;
    }

    setError("");

    // Call the createTeamAPI function with team data
    await createTeamAPI(
      {},
      {
        data: {
          teamName: formData.teamName,
          description: formData.teamDescription,
        },
      }
    );
  };

  // Handle create team response
  useEffect(() => {
    if (createTeamData?.message === "Team created successfully") {
      console.log("Successfully created team:", createTeamData.team);
    }
  }, [createTeamData]);

  // Handle create team errors
  useEffect(() => {
    if (createTeamError) {
      setError("Failed to create team. Please try again.");
    }
  }, [createTeamError]);

  return (
    <form onSubmit={handleCreateTeam} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#00ffff] mb-2">
          Create New Team
        </h2>
        <p className="text-[#00ffff]/50 mb-6">
          Set up your team and invite members to collaborate
        </p>

        <div className="space-y-4">
          <FormInput
            label="Team Name *"
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleInputChange}
            placeholder="Enter team name"
            disabled={createTeamLoading}
          />

          <FormTextarea
            label="Team Description *"
            name="teamDescription"
            value={formData.teamDescription}
            onChange={handleInputChange}
            placeholder="Describe your team's purpose and goals (max 200 words)"
            rows={3}
            maxLength={1000}
            disabled={createTeamLoading}
          />
        </div>
      </div>

      <ErrorMessage message={error} />

      {createTeamData?.message === "Team created successfully" && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <p className="text-green-400 text-sm">
            Successfully created team: {createTeamData.team.teamName}
          </p>
          <p className="text-green-400 text-xs mt-1">
            Team Code: {createTeamData.team.teamCode}
          </p>
        </div>
      )}

      <SubmitButton
        loading={createTeamLoading}
        disabled={!formData.teamName.trim()}
        loadingText="Creating..."
        text="Create Team"
      />
    </form>
  );
}