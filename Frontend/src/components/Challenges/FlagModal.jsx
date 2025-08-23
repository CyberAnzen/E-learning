import React, { useState } from "react";
import { X, Flag, Send, AlertTriangle, Check, Users, User } from "lucide-react";

const FlagModal = ({
  isOpen,
  onClose,
  onSubmitFlag,
  challengeData,
  loading,
  error,
  success,
}) => {
  const [flag, setFlag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isTeamChallenge = challengeData?.Challenge?.submittedBy;
  const attempts = challengeData?.Challenge?.attempt ?? 0;
  const maxAttempts = 5;
  const remainingAttempts = maxAttempts - attempts;
  const isDisabled = attempts >= maxAttempts;
  const flagSubmitted = Boolean(challengeData?.Challenge?.Flag_Submitted);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flag.trim() || isSubmitting || isDisabled || flagSubmitted) return;

    setIsSubmitting(true);
    try {
      await onSubmitFlag({
        Flag: flag.trim(),
        ChallengeId: challengeData?.Challenge?.id,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFlag("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-900/95 backdrop-blur-md border border-teal-500/50 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="relative h-16 bg-gradient-to-r from-teal-500/20 to-teal-600/30 border-b border-teal-500/50">
          <div className="flex items-center justify-between px-6 h-full">
            <div className="flex items-center gap-3">
              <Flag className="w-6 h-6 text-teal-400" />
              <span className="text-teal-300 font-mono text-lg tracking-wider">
                FLAG SUBMISSION TERMINAL
              </span>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-teal-400 hover:text-teal-300 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Challenge Info */}
          <div className="flex items-center justify-between p-4 border border-teal-500/30 rounded-lg bg-black/30">
            <div className="flex items-center gap-3">
              <Flag className="w-5 h-5 text-teal-400" />
              <span className="text-teal-300 font-mono">Challenge:</span>
            </div>
            <span className="text-teal-400 font-mono text-lg font-bold">
              {challengeData?.Challenge?.title || "Unknown Challenge"}
            </span>
          </div>

          {/* Team/Individual Indicator */}
          {isTeamChallenge && (
            <div className="flex items-center justify-between p-4 border border-blue-500/30 rounded-lg bg-blue-950/20">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-mono">Team Challenge:</span>
              </div>
              <span className="text-blue-400 font-mono text-sm">
                Submitted by: {challengeData.Challenge.submittedBy.username}
              </span>
            </div>
          )}

          {/* Attempts Counter */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-teal-300/60 font-mono">Attempts Used:</span>
              <span
                className={`font-mono ${
                  attempts >= 4 ? "text-red-400" : "text-teal-400"
                }`}
              >
                {attempts} / {maxAttempts}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-300/60 font-mono">Remaining:</span>
              <span
                className={`font-mono ${
                  remainingAttempts <= 1 ? "text-red-400" : "text-teal-400"
                }`}
              >
                {remainingAttempts}
              </span>
            </div>
          </div>

          {/* Warning for low attempts */}
          {remainingAttempts <= 1 &&
            remainingAttempts > 0 &&
            !flagSubmitted && (
              <div className="p-3 border border-orange-500/30 rounded-lg bg-orange-950/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <div className="text-orange-300 font-mono text-sm">
                    <div className="font-bold">⚠ FINAL ATTEMPT WARNING</div>
                    <div className="text-xs mt-1">
                      This is your last chance. Double-check your flag before
                      submission.
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Success Message */}
          {flagSubmitted && (
            <div className="p-4 border border-green-500/30 rounded-lg bg-green-950/20">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-400" />
                <div className="text-green-300 font-mono">
                  <div className="font-bold text-lg">FLAG ACCEPTED ✓</div>
                  <div className="text-sm mt-1">
                    Challenge completed successfully!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 border border-red-500/30 rounded-lg bg-red-950/30">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div className="text-red-400 font-mono text-sm">{error}</div>
              </div>
            </div>
          )}

          {/* Success Message for correct submission */}
          {success && (
            <div className="p-3 border border-green-500/30 rounded-lg bg-green-950/30">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <div className="text-green-400 font-mono text-sm">
                  {success}
                </div>
              </div>
            </div>
          )}

          {/* Flag Input Form */}
          {!flagSubmitted && !isDisabled && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-teal-400 font-mono text-sm block">
                  Enter Flag:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="CTF{example_flag_here}"
                    className="w-full px-4 py-3 bg-black/50 border border-teal-500/30 rounded-lg text-teal-300 font-mono placeholder-teal-600/50 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    disabled={isSubmitting}
                    autoComplete="off"
                    spellCheck="false"
                  />
                  {flag && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                <div className="text-teal-400/60 font-mono text-xs">
                  Flags are case-sensitive. Usually in format: CTF
                </div>
              </div>
            </form>
          )}

          {/* Exceeded attempts message */}
          {isDisabled && !flagSubmitted && (
            <div className="p-4 border border-red-500/30 rounded-lg bg-red-950/20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div className="text-red-300 font-mono">
                  <div className="font-bold text-lg">ATTEMPTS EXCEEDED</div>
                  <div className="text-sm mt-1">
                    Maximum submission attempts reached. Contact administrator
                    if needed.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-teal-500/20">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 border border-teal-500/30 rounded bg-black/30 text-teal-300 font-mono text-sm hover:bg-teal-500/10 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Cancel"}
            </button>

            {!flagSubmitted && !isDisabled && (
              <button
                onClick={handleSubmit}
                disabled={!flag.trim() || isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-mono text-sm rounded hover:from-teal-500 hover:to-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Flag
                  </>
                )}
              </button>
            )}
          </div>

          {/* Footer info
          <div className="text-center pt-2 border-t border-teal-500/10">
            <div className="text-teal-400/40 font-mono text-xs">
              NEURAL_INTERFACE_v2.1 • QUANTUM_ENCRYPTION_ENABLED
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default FlagModal;
