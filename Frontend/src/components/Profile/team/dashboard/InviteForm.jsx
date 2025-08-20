import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../../../context/AppContext";
import Usefetch from "../../../../hooks/Usefetch";

export default function InviteForm({ onClose }) {
  const { team, fetchTeam } = useAppContext();
  const [memberId, setMemberId] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    retry,
    error: inviteError,
    loading: inviteLoading,
  } = Usefetch("team/generateInvite", "post", null, {}, false);

  const SUCCESS_DISPLAY_MS = 1200;
  const ERROR_DISPLAY_MS = 2200;

  const successTimerRef = useRef(null);
  const errorTimerRef = useRef(null);

  useEffect(() => {
    if (inviteError) {
      // clear any previous success timers
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }

      setLocalError(inviteError);

      // clear previous error timer and start a new one
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setLocalError("");
        errorTimerRef.current = null;
      }, ERROR_DISPLAY_MS);
    }
  }, [inviteError]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
        errorTimerRef.current = null;
      }
    };
  }, []);

  const inputStyle =
    "w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#00bfff]/15 via-[#1e90ff]/10 to-[#00bfff]/5 border border-[#00bfff]/30 transition-all duration-300 text-white placeholder-[#00bfff]/50 outline-none focus:outline-none focus:ring-1 focus:ring-[#00bfff]";

  const handleInvite = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!memberId.trim()) {
      // show error briefly
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setLocalError("Please enter a user ID");
      errorTimerRef.current = setTimeout(() => {
        setLocalError("");
        errorTimerRef.current = null;
      }, ERROR_DISPLAY_MS);
      return;
    }

    setIsInviting(true);
    try {
      await retry(undefined, {
        data: {
          teamId: team?._id,
          memberId: memberId.trim(),
        },
      });

      // success path: show message for a bit then close
      if (!inviteError) {
        // clear any existing error timers
        if (errorTimerRef.current) {
          clearTimeout(errorTimerRef.current);
          errorTimerRef.current = null;
        }

        setSuccessMsg("Invite sent");

        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => {
          setSuccessMsg("");
          successTimerRef.current = null;
          onClose();
        }, SUCCESS_DISPLAY_MS);
        await fetchTeam();
        setMemberId("");
      } else {
        // if hook reported an error, show it briefly
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        setLocalError(inviteError);
        errorTimerRef.current = setTimeout(() => {
          setLocalError("");
          errorTimerRef.current = null;
        }, ERROR_DISPLAY_MS);
      }
    } catch (error) {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }

      const msg = error?.message || "Failed to invite member";
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setLocalError(msg);
      errorTimerRef.current = setTimeout(() => {
        setLocalError("");
        errorTimerRef.current = null;
      }, ERROR_DISPLAY_MS);

      console.error("Failed to invite member:", error);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <form
      onSubmit={handleInvite}
      className="mt-6 p-4 bg-[#00ffff]/5 rounded-lg border border-[#00ffff]/20"
    >
      <div className="flex flex-col gap-3">
        <label className="text-sm text-[#00bfff]/90">Invite by User ID</label>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="Enter user ID"
            className={inputStyle + " flex-1"}
            disabled={isInviting || inviteLoading}
          />
          <button
            type="submit"
            disabled={isInviting || inviteLoading || !memberId.trim()}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#00bfff] to-[#1e90ff] text-white px-6 py-3 rounded-lg hover:from-[#00bfff]/90 hover:to-[#1e90ff]/90 disabled:opacity-50 transition-all duration-300"
          >
            {isInviting || inviteLoading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              "Send Invite"
            )}
          </button>
        </div>

        {localError ? (
          <div className="mt-1 text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded">
            {localError}
          </div>
        ) : null}

        {successMsg ? (
          <div className="mt-1 inline-flex items-center gap-2 text-sm text-green-300 bg-green-900/10 px-3 py-2 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {successMsg}
          </div>
        ) : null}
      </div>
    </form>
  );
}
