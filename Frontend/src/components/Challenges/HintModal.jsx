import React from "react";
import { X, Lightbulb, Coins } from "lucide-react";

const HintModal = ({ isOpen, onClose, hint, onUnlockHint, currentScore }) => {
  if (!isOpen || !hint) return null;

  const canAfford = currentScore >= hint.cost;

  const handleUnlockHint = () => {
    // This will reduce the score by the hint cost and mark hint as used
    onUnlockHint(hint.id, hint.cost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-900/95 backdrop-blur-md border border-teal-500/50 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="relative h-16 bg-gradient-to-r from-teal-500/20 to-teal-600/30 border-b border-teal-500/50">
          <div className="flex items-center justify-between px-6 h-full">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-teal-400" />
              <span className="text-teal-300 font-mono text-lg tracking-wider">
                HINT ACCESS REQUEST
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Cost display */}
          <div className="flex items-center justify-between p-4 border border-teal-500/30 rounded-lg bg-black/30">
            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-teal-300 font-mono">Hint Cost:</span>
            </div>
            <span className="text-yellow-400 font-mono text-xl font-bold">
              -{hint.cost} points
            </span>
          </div>

          {/* Current score */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-teal-300/60 font-mono">Current Score:</span>
            <span
              className={`font-mono ${
                canAfford ? "text-teal-400" : "text-red-400"
              }`}
            >
              {currentScore} points
            </span>
          </div>

          {/* Score after hint preview */}
          {!hint.used && canAfford && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-teal-300/40 font-mono">After unlock:</span>
              <span className="text-teal-300/60 font-mono">
                {currentScore - hint.cost} points
              </span>
            </div>
          )}

          {/* Hint content or unlock button */}
          {hint.used ? (
            <div className="p-4 border border-teal-500/30 rounded-lg bg-teal-500/5">
              <div className="text-teal-400 font-mono text-sm mb-2">
                HINT CONTENT:
              </div>
              <div className="text-teal-300 font-mono text-sm leading-relaxed">
                {hint.content || hint.hint || "No hint content available"}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border border-teal-500/30 rounded-lg bg-black/30">
                <div className="text-center">
                  <div className="text-teal-400 font-mono text-lg mb-2">
                    🔒 LOCKED HINT
                  </div>
                  <div className="text-teal-300/60 font-mono text-sm">
                    Unlock this hint to reveal helpful information for solving
                    the challenge. Your score will be reduced by the hint cost.
                  </div>
                </div>
              </div>

              {!canAfford && (
                <div className="p-3 border border-red-500/30 rounded-lg bg-red-950/30">
                  <div className="text-red-400 font-mono text-sm text-center">
                    ⚠ Insufficient points to unlock this hint
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-teal-500/20">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-teal-500/30 rounded bg-black/30 text-teal-300 font-mono text-sm hover:bg-teal-500/10 transition-colors"
            >
              Close
            </button>
            {!hint.used && canAfford && (
              <button
                onClick={handleUnlockHint}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-mono text-sm rounded hover:from-teal-500 hover:to-teal-400 transition-all"
              >
                Unlock Hint (-{hint.cost} pts)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HintModal;
