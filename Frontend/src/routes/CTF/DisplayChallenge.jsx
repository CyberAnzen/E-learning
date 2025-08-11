import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  Zap,
  Shield,
  Settings,
  Send,
  Check,
  Activity,
  Database,
  Cpu,
  Wifi,
  Monitor,
  Flag,
  Lightbulb,
  Lock,
  Unlock,
  Paperclip,
  Download,
  Eye,
  Coins,
} from "lucide-react";
import {
  CircuitPattern,
  HexagonalFrame,
  TechGrid,
  DataStream,
  HolographicDisplay,
} from "./SVGelements";
import Usefetch from "../../hooks/Usefetch";
import HintModal from "../../components/Challenges/HintModal";

function DisplayChallenge() {
  const textRef = useRef(null);

  const { challengeId } = useParams();
  const {
    Data: ChallengeData,
    error: fetchError,
    loading,
    retry: fetchRetry,
  } = Usefetch(`challenge/${challengeId}`, "get", null, {}, true);

  // Hint fetching hook - initially not active
  const [hintEndpoint, setHintEndpoint] = useState("");
  const {
    Data: HintData,
    error: hintError,
    loading: hintLoading,
    retry: fetchHintRetry,
  } = Usefetch(hintEndpoint, "get", null, {}, false);

  const attempts = ChallengeData?.Challenge?.attempt ?? 0;
  const flagSubmitted = Boolean(ChallengeData?.Challenge?.Flag_Submitted);
  const disabled = attempts >= 5;
  const [activeStatus, setActiveStatus] = useState(true);
  const [dataFlow, setDataFlow] = useState(0);
  const [systemLoad, setSystemLoad] = useState(67);
  const [isMobile, setIsMobile] = useState(false);

  // Hint management state
  const [hints, setHints] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [selectedHint, setSelectedHint] = useState(null);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [hintContents, setHintContents] = useState({}); // Store fetched hint contents

  // Initialize hints and score when data loads
  useEffect(() => {
    if (ChallengeData?.Challenge) {
      setHints(ChallengeData.Challenge.hints || []);
      setCurrentScore(ChallengeData.Challenge.score || 0);
    }
  }, [ChallengeData]);

  // Handle hint data response
  useEffect(() => {
    if (HintData?.Challenge) {
      // Update the challenge data with the latest hint information
      setHints(HintData.Challenge.hints || []);
      setCurrentScore(HintData.Challenge.score || 0);

      // Store hint content if provided in response
      if (HintData.hintContent) {
        const hintId = hintEndpoint.split("/").pop();
        setHintContents((prev) => ({
          ...prev,
          [hintId]: HintData.hintContent,
        }));
      }
    }
  }, [HintData, hintEndpoint]);

  const handleCopy = (e) => {
    e.preventDefault();
    const textToCopy = "Don't Use AI bruh!!! 😏";
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // alert("Don't Use AI bro 😏");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleHintClick = async (hint, index) => {
    // If hint is already used, show it directly
    if (hint.used) {
      const hintWithContent = {
        ...hint,
        content: hint.hint || hintContents[hint.id] || "Hint content loaded...",
      };
      setSelectedHint(hintWithContent);
      setIsHintModalOpen(true);
      return;
    }

    // If hint content is not fetched yet, fetch it
    if (!hintContents[hint.id]) {
      try {
        // Set the endpoint to trigger the fetch
        const endpoint = `challenge/${challengeId}/hint/${hint.id}`;
        setHintEndpoint(endpoint);

        // Trigger the fetch manually using retry function
        await fetchHintRetry();

        // Store a placeholder hint content for now
        setHintContents((prev) => ({
          ...prev,
          [hint.id]: `${
            ChallengeData?.Challenge?.hints[index]?.hint ||
            "Loading hint content..."
          }`,
        }));
      } catch (error) {
        console.error("Failed to fetch hint:", error);
      }
    }

    const hintWithContent = {
      ...hint,
      content: hint.hint || hintContents[hint.id] || "Hint content loaded...",
    };
    setSelectedHint(hintWithContent);
    setIsHintModalOpen(true);
  };

  const handleUnlockHint = async (hintId, cost) => {
    try {
      // Set endpoint for unlocking hint (POST request)
      const endpoint = `challenge/${challengeId}/hint/${hintId}`;
      setHintEndpoint(endpoint);

      // Make API call to unlock hint using retry function with POST method
      await fetchHintRetry({}, { data: null });

      // Update local state - mark hint as used and reduce score
      setHints((prevHints) =>
        prevHints.map((hint) =>
          hint.id === hintId ? { ...hint, used: true } : hint
        )
      );
      setCurrentScore((prevScore) => Math.max(0, prevScore - cost));

      console.log(`Hint ${hintId} unlocked for ${cost} points`);
    } catch (error) {
      console.error("Failed to unlock hint:", error);
    }
  };

  const getNextUnlockableHintIndex = () => {
    return hints.findIndex((hint) => !hint.used);
  };

  const canUnlockHint = (hintIndex) => {
    const nextUnlockableIndex = getNextUnlockableHintIndex();
    return nextUnlockableIndex === -1 || hintIndex <= nextUnlockableIndex;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDataFlow((prev) => (prev + 1) % 100);
      setSystemLoad((prev) => 60 + Math.sin(Date.now() / 1000) * 10);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile blocking overlay
  if (isMobile) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 backdrop-blur-lg bg-black/80"></div>
        <div className="relative z-10 text-center p-6">
          <Monitor className="w-20 h-20 text-teal-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold text-teal-400 font-mono mb-4">
            SCREEN SIZE INCOMPATIBLE
          </h2>
          <div className="text-teal-300 font-mono text-sm space-y-2">
            <p>This interface requires a larger display</p>
            <p>Please switch to:</p>
            <div className="mt-4 space-y-1 text-teal-400">
              <p>• Tablet (768px+)</p>
              <p>• Laptop</p>
              <p>• Desktop</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[85vh] relative overflow-hidden">
      {/* Background tech grid */}
      <div className="absolute inset-0 opacity-20">
        <TechGrid className="absolute top-0 left-0 w-full h-full" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-2 left-2 sm:top-6 sm:left-6 lg:top-10 lg:left-10 w-12 h-12 sm:w-20 sm:h-20 lg:w-32 lg:h-32 opacity-30">
          <CircuitPattern className="w-full h-full animate-pulse" />
        </div>
        <div className="absolute bottom-2 right-2 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-40 lg:h-40 opacity-20">
          <CircuitPattern
            className="w-full h-full animate-spin"
            style={{ animationDuration: "30s" }}
          />
        </div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center p-1 sm:p-2 lg:p-4">
        {/* Main holographic container */}
        <div className="relative w-full max-w-7xl h-full">
          {/* Background holographic frame */}
          <HexagonalFrame className="absolute inset-0 w-full h-full opacity-60" />

          {/* Main content container */}
          <div className="relative bg-gradient-to-br from-black/90 via-gray-900/80 to-black/90 backdrop-blur-sm border border-teal-500/50 rounded-lg overflow-hidden h-full flex flex-col">
            {/* Top header with data stream */}
            <div className="relative h-10 sm:h-12 lg:h-16 bg-gradient-to-r from-teal-500/20 to-teal-600/30 border-b border-teal-500/50 flex-shrink-0">
              <div className="relative z-10 flex items-center justify-between px-2 sm:px-4 lg:px-6 h-full">
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
                  <span className="text-teal-300 font-mono text-xs sm:text-sm tracking-wider">
                    {ChallengeData?.Challenge?.category || ""}{" "}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-300 font-mono text-xs sm:text-sm">
                    {ChallengeData?.Challenge?.difficulty
                      ? ChallengeData.Challenge.difficulty
                          .charAt(0)
                          .toUpperCase() +
                        ChallengeData.Challenge.difficulty
                          .slice(1)
                          .toLowerCase()
                      : "Easy"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left holographic display - Hints and Attachments */}
              <div className="relative w-48 sm:w-56 lg:w-80 p-2 sm:p-4 lg:p-6 border-r border-teal-500/30 hidden md:block">
                {/* Hints Section */}
                <div className="relative mb-6">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                      <div className="text-lg sm:text-xl font-bold text-teal-400">
                        Hints
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {hints.map((hint, index) => {
                      const isUnlockable = canUnlockHint(index);
                      const isUsed = hint.used;
                      const isLocked = !isUsed && !isUnlockable;

                      return (
                        <div
                          key={hint.id}
                          className={`relative p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                            isUsed
                              ? "border-green-400/50 bg-green-500/10 hover:bg-green-500/20"
                              : isUnlockable
                              ? "border-teal-400/50 bg-teal-500/10 hover:bg-teal-500/20"
                              : "border-gray-600/30 bg-gray-800/20 cursor-not-allowed"
                          } ${isLocked ? "blur-sm" : ""}`}
                          onClick={() =>
                            !isLocked && handleHintClick(hint, index)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isUsed ? (
                                <Unlock className="w-4 h-4 text-green-400" />
                              ) : isUnlockable ? (
                                <Eye className="w-4 h-4 text-teal-400" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-500" />
                              )}
                              <span
                                className={`font-mono text-sm ${
                                  isUsed
                                    ? "text-green-300"
                                    : isUnlockable
                                    ? "text-teal-300"
                                    : "text-gray-500"
                                }`}
                              >
                                Hint {index + 1}
                              </span>
                            </div>
                            <div
                              className={`font-mono text-xs ${
                                isUsed
                                  ? "text-green-400"
                                  : isUnlockable
                                  ? "text-yellow-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {isUsed ? "USED" : `${hint.cost} pts`}
                            </div>
                          </div>
                          {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Lock className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {hints.length === 0 && (
                      <div className="text-center p-4 border border-gray-600/30 rounded-lg bg-gray-800/20">
                        <div className="text-gray-500 font-mono text-sm">
                          No hints available
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="relative">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                      <div className="text-lg sm:text-xl font-bold text-teal-400">
                        Attachments
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ChallengeData?.Challenge?.attachments?.length > 0 ? (
                      ChallengeData.Challenge.attachments.map(
                        (attachment, index) => (
                          <div
                            key={index}
                            className="p-3 border border-teal-400/50 bg-teal-500/10 rounded-lg hover:bg-teal-500/20 cursor-pointer transition-all duration-300"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Paperclip className="w-4 h-4 text-teal-400" />
                                <span className="font-mono text-sm text-teal-300 truncate">
                                  {attachment.name || `File ${index + 1}`}
                                </span>
                              </div>
                              <Download className="w-4 h-4 text-teal-400" />
                            </div>
                            {attachment.size && (
                              <div className="text-xs text-teal-400/60 font-mono mt-1">
                                {attachment.size}
                              </div>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-center p-4 border border-gray-600/30 rounded-lg bg-gray-800/20">
                        <div className="text-gray-500 font-mono text-sm">
                          No attachments
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center main display */}
              <div className="flex-1 p-2 sm:p-4 lg:p-8 overflow-hidden flex flex-col">
                {/* Warning section with advanced styling */}
                <div className="relative mb-3 sm:mb-4 lg:mb-6 flex-shrink-0">
                  <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/20 to-transparent rounded-lg blur-sm"></div>
                  <div className="relative flex items-center gap-2 sm:gap-3 lg:gap-4 p-2 sm:p-3 lg:p-4 border border-red-500/30 rounded-lg bg-red-950/50">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-red-500 animate-pulse flex-shrink-0" />
                    <div className="text-red-300 font-mono text-xs sm:text-sm tracking-wide">
                      <div className="text-red-400 font-bold mb-1">WARNING</div>
                      <div className="text-xs sm:text-sm">
                        Virtual Instances may freeze, may not stable, won't work
                        as expected. They are in the experimental stage.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main title with holographic effect */}
                <div className="relative mb-3 sm:mb-4 lg:mb-6 flex-shrink-0">
                  <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/10 via-teal-400/20 to-teal-500/10 rounded-lg blur-lg"></div>
                  <div className="relative">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-teal-400 font-mono tracking-wider mb-1 sm:mb-2 glow text-center">
                      {ChallengeData?.Challenge?.title}
                    </h1>
                    <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-transparent rounded-full"></div>
                    <div className="h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent mt-1"></div>
                  </div>
                </div>

                <div className="text-teal-400 font-bold mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">
                  Description
                </div>
                <div className="flex-1 overflow-hidden">
                  <div
                    className="rounded-md border border-teal-300/20 backdrop-blur-md bg-teal-300/5 h-full"
                    ref={textRef}
                    onCopy={handleCopy}
                    style={{
                      overflowY: "scroll",
                      padding: "8px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      userSelect: "text",
                    }}
                  >
                    {/* Safety protocols */}
                    <div className="space-y-4">
                      <div className="text-teal-300/90 font-mono text-xs sm:text-sm tracking-wide">
                        <div>
                          {ChallengeData?.Challenge?.description ||
                            "No description available."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right technical panel - responsive sizing */}
              <div className="w-40 sm:w-48 lg:w-64 p-2 sm:p-3 lg:p-6 border-l border-teal-500/30 bg-gradient-to-b from-teal-500/10 to-black/50">
                {/* Circuit pattern overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <CircuitPattern className="w-full h-full" />
                </div>

                <div className="relative space-y-3 sm:space-y-4 lg:space-y-6 h-full flex flex-col">
                  {/* Power core display */}
                  <div className="text-center flex-shrink-0">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-20 lg:h-20 mx-auto mb-1 sm:mb-2 lg:mb-4">
                      <div
                        className="absolute inset-0 border-2 border-teal-400/50 rounded-full animate-spin"
                        style={{ animationDuration: "10s" }}
                      ></div>
                      <div
                        className="absolute inset-2 border border-teal-300/30 rounded-full animate-spin"
                        style={{
                          animationDuration: "15s",
                          animationDirection: "reverse",
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 lg:w-8 lg:h-8 text-teal-400 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-teal-300 font-mono text-xs sm:text-sm">
                      Start Instance{" "}
                      <span className="text-red-300">(Experimental)</span>
                    </div>
                  </div>

                  {/* Technical readouts */}
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4 flex-1">
                    <div className="p-1.5 sm:p-2 lg:p-3 border border-teal-500/30 rounded bg-black/30">
                      <div className="text-teal-400 font-mono text-xs sm:text-sm mb-1">
                        SSH connection
                      </div>
                      <div className="text-teal-300 font-mono text-xs sm:text-sm">
                        DS4-7654
                      </div>
                      <div className="text-teal-300 font-mono text-xs sm:text-sm">
                        893-5
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-center items-center gap-2 text-xs sm:text-sm">
                        <Coins className="w-3 h-3 text-yellow-400" />
                        <span className="text-gray-300">Score:</span>
                        <span className="font-semibold text-teal-400">
                          {currentScore} pts
                        </span>
                      </div>

                      <div className="flex justify-center items-center gap-2 text-xs sm:text-sm">
                        <span className={`text-gray-300`}>Attempts:</span>
                        <span
                          className={`font-semibold ${
                            !disabled || flagSubmitted
                              ? "text-teal-400"
                              : "text-red-400"
                          }`}
                        >
                          {attempts}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
                  </div>

                  {/* Control buttons */}
                  <div className="space-y-2 sm:space-y-3 flex-shrink-0">
                    <button className="w-full p-1 sm:p-1.5 lg:p-2 border border-teal-500/30 rounded bg-black/30 hover:bg-teal-500/10 transition-colors">
                      <span className="text-teal-300 text-xs sm:text-sm">
                        LeaderBoard
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      aria-disabled={disabled}
                      title={
                        flagSubmitted
                          ? "Flag submitted"
                          : disabled
                          ? "Attempt exceeded"
                          : "Submit flag"
                      }
                      onClick={
                        disabled
                          ? undefined
                          : () => setActiveStatus(!activeStatus)
                      }
                      className={`flex justify-around items-center w-full p-1.5 sm:p-2 lg:p-3 rounded-lg backdrop-blur-md border transition-all duration-300 group ${
                        flagSubmitted
                          ? "border-green-400/50 bg-white/10 cursor-not-allowed opacity-95"
                          : !disabled
                          ? "border-teal-400/50 bg-white/10 hover:bg-white/20 hover:shadow-lg"
                          : "border-red-400/30 bg-white/5 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <span
                        className={`${
                          flagSubmitted
                            ? "text-green-300"
                            : !disabled
                            ? "text-teal-400"
                            : "text-red-400"
                        } font-mono text-sm sm:text-md lg:text-lg`}
                      >
                        {flagSubmitted
                          ? "Flag Submitted"
                          : !disabled
                          ? "Submit Flag"
                          : "Attempt Exceeded"}
                      </span>

                      {flagSubmitted ? (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-300 transition-transform duration-300" />
                      ) : !disabled ? (
                        <Flag className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-cyan-300 transition-transform duration-300 group-hover:scale-110" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-red-400 transition-transform duration-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating holographic elements - responsive positioning */}
          <div className="absolute -top-6 sm:-top-8 lg:-top-16 left-1/2 transform -translate-x-1/2">
            <div className="text-teal-400/60 font-mono text-xs sm:text-sm text-center">
              <div>NEURAL_INTERFACE_ACTIVE</div>
              <div className="mt-1 flex justify-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-teal-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 sm:-bottom-8 lg:-bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="text-teal-400/60 font-mono text-xs sm:text-sm text-center">
              <div className="flex justify-center gap-1 mb-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-2 sm:h-3 bg-teal-400 ${
                      i === 3 ? "opacity-100" : "opacity-30"
                    }`}
                  ></div>
                ))}
              </div>
              <div>QUANTUM_SIGNATURE_DETECTED</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        hint={selectedHint}
        onUnlockHint={handleUnlockHint}
        currentScore={currentScore}
      />

      {/* Additional responsive styles */}
      <style jsx>{`
        .glow {
          text-shadow: 0 0 20px rgba(45, 212, 191, 0.5);
        }

        /* Custom scrollbar for description area */
        div[style*="overflowY: scroll"]::-webkit-scrollbar {
          width: 3px;
        }

        div[style*="overflowY: scroll"]::-webkit-scrollbar-track {
          background: rgba(45, 212, 191, 0.1);
          border-radius: 2px;
        }

        div[style*="overflowY: scroll"]::-webkit-scrollbar-thumb {
          background: rgba(45, 212, 191, 0.5);
          border-radius: 2px;
        }

        div[style*="overflowY: scroll"]::-webkit-scrollbar-thumb:hover {
          background: rgba(45, 212, 191, 0.7);
        }

        /* Responsive text scaling */
        @media (max-width: 1024px) {
          .glow {
            text-shadow: 0 0 8px rgba(45, 212, 191, 0.5);
          }
        }

        @media (max-width: 640px) {
          .glow {
            text-shadow: 0 0 5px rgba(45, 212, 191, 0.5);
          }
        }

        /* Optimize for half-screen laptop displays */
        @media (min-width: 600px) and (max-width: 900px) {
          .glow {
            text-shadow: 0 0 6px rgba(45, 212, 191, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

export default DisplayChallenge;
