import React, { useState, useEffect } from "react";
import Usefetch from "../../../../hooks/Usefetch";
import FormInput from "../ui/FormInput";
import ErrorMessage from "../ui/ErrorMessage";
import SuccessMessage from "../ui/SuccessMessage";
import SubmitButton from "../ui/SubmitButton";

export default function JoinTeamForm() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    teamCode: "",
    inviteCode: "",
  });

  // Use Usefetch hook for accepting invite - don't auto-trigger
  const {
    Data: inviteData,
    error: inviteError,
    loading: inviteLoading,
    retry: acceptInvite,
  } = Usefetch("team/acceptInvite", "post", null, {}, false);

  const handleInputChange = () => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleJoinTeam = async () => {
    e.preventDefault();

    if (!formData.teamCode.trim() || !formData.inviteCode.trim()) {
      setError("Please enter both team code and invite code");
      return;
    }

    setError("");

    // Call the acceptInvite function with both codes
    await acceptInvite(
      {},
      {
        data: {
          teamCode: formData.teamCode,
          inviteCode: formData.inviteCode,
        },
      }
    );
  };

  // Handle invite response
  useEffect(() => {
    if (inviteData?.message === "Invite accepted successfully") {
      console.log("Successfully joined team:", inviteData.data);
    }
  }, [inviteData]);

  // Handle invite errors
  useEffect(() => {
    if (inviteError) {
      setError("Invalid invite code. Please check and try again.");
    }
  }, [inviteError]);

  return (
    <form onSubmit={handleJoinTeam} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#00ffff] mb-2">
          Join Existing Team
        </h2>
        <p className="text-[#00ffff]/50 mb-6">
          Enter the invite code provided by your team leader
        </p>

        <div className="space-y-4">
          <FormInput
            label="Team Code *"
            type="text"
            name="teamCode"
            value={formData.teamCode}
            onChange={handleInputChange}
            placeholder="Enter team code"
            disabled={inviteLoading}
          />

          <FormInput
            label="Invite Code *"
            type="text"
            name="inviteCode"
            value={formData.inviteCode}
            onChange={handleInputChange}
            placeholder="Enter invite code"
            disabled={inviteLoading}
          />
        </div>
      </div>

      <ErrorMessage message={error} />

      {inviteData?.message === "Invite accepted successfully" && (
        <SuccessMessage message={`Successfully joined team: ${inviteData.data.teamName}`} />
      )}

      <SubmitButton
        loading={inviteLoading}
        disabled={!formData.teamCode.trim() || !formData.inviteCode.trim()}
        loadingText="Joining..."
        text="Join Team"
      />
    </form>
  );
}