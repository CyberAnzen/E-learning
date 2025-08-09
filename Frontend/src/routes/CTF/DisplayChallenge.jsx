import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  Zap,
  Shield,
  Settings,
  Activity,
  Database,
  Cpu,
  Wifi,
} from "lucide-react";
import {
  CircuitPattern,
  HexagonalFrame,
  TechGrid,
  DataStream,
  HolographicDisplay,
} from "./SVGelements";
import Usefetch from "../../hooks/Usefetch";
function DisplayChallenge() {
  const { ChallengId } = useParams();
  const {
    Data: ChallengesData,
    error: fetchError,
    loading,
    retry: fetchRetry,
  } = Usefetch(`challenge/${ChallengId}`, "get", null, {}, true);
  const [activeStatus, setActiveStatus] = useState(true);
  const [dataFlow, setDataFlow] = useState(0);
  const [systemLoad, setSystemLoad] = useState(67);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataFlow((prev) => (prev + 1) % 100);
      setSystemLoad((prev) => 60 + Math.sin(Date.now() / 1000) * 10);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background tech grid */}
      <div className="absolute inset-0 opacity-20">
        <TechGrid className="absolute top-0 left-0 w-full h-full" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 opacity-30">
          <CircuitPattern className="w-full h-full animate-pulse" />
        </div>
        <div className="absolute bottom-10 right-10 w-40 h-40 opacity-20">
          <CircuitPattern
            className="w-full h-full animate-spin"
            style={{ animationDuration: "30s" }}
          />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Main holographic container */}
        <div className="relative max-w-6xl w-full">
          {/* Background holographic frame */}
          <HexagonalFrame className="absolute inset-0 w-full h-full opacity-60" />

          {/* Main content container */}
          <div className="relative bg-gradient-to-br from-black/90 via-gray-900/80 to-black/90 backdrop-blur-sm border border-teal-500/50 rounded-lg overflow-hidden">
            {/* Top header with data stream */}
            <div className="relative h-16 bg-gradient-to-r from-teal-500/20 to-teal-600/30 border-b border-teal-500/50">
              <div className="relative z-10 flex items-center justify-between px-6 h-full">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border border-teal-400 rounded-full flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-teal-300 font-mono text-sm tracking-wider">
                    NEURAL_INTERFACE_v2.1
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-teal-400" />
                  <span className="text-teal-300 font-mono text-xs">
                    QUANTUM_LINK_ACTIVE
                  </span>
                </div>
              </div>
            </div>

            <div className="flex">
              {/* Left holographic display */}
              <div className="relative w-80 p-6 border-r border-teal-500/30">
                <div className="relative h-64 mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold text-teal-400 mb-2">
                        4-6
                      </div>
                      <div className="text-xs text-teal-300 tracking-widest">
                        teal_LEVEL
                      </div>
                    </div>
                  </div>
                </div>

                {/* System metrics */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-300 font-mono text-xs">
                      SYS_LOAD
                    </span>
                    <span className="text-teal-400 font-mono text-xs">
                      {Math.round(systemLoad)}%
                    </span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-300"
                      style={{ width: `${systemLoad}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-teal-300 font-mono text-xs">
                      DATA_FLOW
                    </span>
                    <span className="text-teal-400 font-mono text-xs">
                      {dataFlow}%
                    </span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-600 to-teal-300 transition-all duration-100"
                      style={{ width: `${dataFlow}%` }}
                    />
                  </div>
                </div>

                {/* Status indicators */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activeStatus
                          ? "bg-teal-400 shadow-lg shadow-teal-400/50"
                          : "bg-gray-600"
                      } animate-pulse`}
                    ></div>
                    <span className="text-teal-300 font-mono text-xs">
                      NEURAL_SYNC
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-400 shadow-lg shadow-teal-400/50"></div>
                    <span className="text-teal-300 font-mono text-xs">
                      QUANTUM_STABLE
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                    <span className="text-teal-300 font-mono text-xs">
                      BIOMETRIC_LOCK
                    </span>
                  </div>
                </div>
              </div>

              {/* Center main display */}
              <div className="flex-1 p-8">
                {/* Warning section with advanced styling */}
                <div className="relative mb-8">
                  <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/20 to-transparent rounded-lg blur-sm"></div>
                  <div className="relative flex items-center gap-4 p-4 border border-red-500/30 rounded-lg bg-red-950/50">
                    <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                    <div className="text-red-300 font-mono text-sm tracking-wide">
                      <div className="text-red-400 font-bold mb-1">WARNING</div>
                      <div>
                        Virtual Instances may freeze, may not stable, won't work
                        as expected. They are in the experimental stage.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main title with holographic effect */}
                <div className="relative mb-8">
                  <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/10 via-teal-400/20 to-teal-500/10 rounded-lg blur-lg"></div>
                  <div className="relative">
                    <h1 className="text-6xl font-bold text-teal-400 font-mono tracking-wider mb-2 glow">
                      CRYPTO_PASS/2
                    </h1>
                    <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-transparent rounded-full"></div>
                    <div className="h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent mt-1"></div>
                  </div>
                </div>

                {/* Safety protocols */}
                <div className="space-y-4 mb-8">
                  <div className="text-teal-300/90 font-mono text-sm tracking-wide">
                    <div className="text-teal-400 font-bold mb-2">
                      SAFETY PROTOCOLS ACTIVE
                    </div>
                    <div>
                      DO NOT USE OUTLETS OR CORDS THAT HAVE EXPOSED WIRING
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-teal-500/30 rounded bg-black/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-teal-400" />
                        <span className="text-teal-300 font-mono text-xs">
                          SHIELD_STATUS
                        </span>
                      </div>
                      <div className="text-teal-400 font-mono text-sm">
                        ACTIVE
                      </div>
                    </div>
                    <div className="p-3 border border-teal-500/30 rounded bg-black/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-teal-400" />
                        <span className="text-teal-300 font-mono text-xs">
                          VITALS
                        </span>
                      </div>
                      <div className="text-teal-400 font-mono text-sm">
                        STABLE
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right technical panel */}
              <div className="w-64 p-6 border-l border-teal-500/30 bg-gradient-to-b from-teal-500/10 to-black/50">
                {/* Circuit pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <CircuitPattern className="w-full h-full" />
                </div>

                <div className="relative space-y-6">
                  {/* Power core display */}
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
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
                        <Zap className="w-8 h-8 text-teal-400 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-teal-300 font-mono text-xs">
                      POWER_CORE
                    </div>
                  </div>

                  {/* Technical readouts */}
                  <div className="space-y-4">
                    <div className="p-3 border border-teal-500/30 rounded bg-black/30">
                      <div className="text-teal-400 font-mono text-xs mb-1">
                        SYSTEM_ID
                      </div>
                      <div className="text-teal-300 font-mono text-sm">
                        DS4-7654
                      </div>
                      <div className="text-teal-300 font-mono text-sm">
                        893-5
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-teal-300/60 font-mono text-xs">
                          TEMP:
                        </span>
                        <span className="text-teal-400 font-mono text-xs">
                          23.4°C
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-teal-300/60 font-mono text-xs">
                          VOLT:
                        </span>
                        <span className="text-teal-400 font-mono text-xs">
                          12.8V
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-teal-300/60 font-mono text-xs">
                          AMP:
                        </span>
                        <span className="text-teal-400 font-mono text-xs">
                          4.2A
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-teal-300/60 font-mono text-xs">
                          FREQ:
                        </span>
                        <span className="text-teal-400 font-mono text-xs">
                          2.4GHz
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>

                    {/* Database status */}
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-teal-400" />
                      <span className="text-teal-300 font-mono text-xs">
                        DB_SYNC
                      </span>
                    </div>
                  </div>

                  {/* Control buttons */}
                  <div className="space-y-3">
                    <button
                      className="w-full p-3 border border-teal-500/50 rounded bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300 group"
                      onClick={() => setActiveStatus(!activeStatus)}
                    >
                      <Settings className="w-5 h-5 text-teal-400 mx-auto group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    <button className="w-full p-2 border border-teal-500/30 rounded bg-black/30 hover:bg-teal-500/10 transition-colors">
                      <span className="text-teal-300 font-mono text-xs">
                        DIAGNOSTICS
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom status bar */}
            <div className="h-12 bg-gradient-to-r from-teal-500/20 to-teal-600/30 border-t border-teal-500/50 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <span className="text-teal-400/60 font-mono text-xs">
                  SYS_ONLINE
                </span>
                <div className="w-px h-4 bg-teal-500/50"></div>
                <span className="text-teal-300 font-mono text-xs">
                  2024.01.15_14:23:45
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < 3 ? "bg-teal-400" : "bg-gray-600"
                    } ${i < 3 ? "animate-pulse" : ""}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating holographic elements */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="text-teal-400/60 font-mono text-xs text-center">
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

          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="text-teal-400/60 font-mono text-xs text-center">
              <div className="flex justify-center gap-1 mb-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-3 bg-teal-400 ${
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
    </div>
  );
}

export default DisplayChallenge;
