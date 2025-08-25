import React from "react";
import { Target } from "lucide-react";

// Static components that don't need to re-render
const RadarStaticElements = React.memo(() => (
  <>
    <defs>
      <radialGradient id="cyberRadarGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00ff9f" stopOpacity="0.12" />
        <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.08" />
        <stop offset="70%" stopColor="#0891b2" stopOpacity="0.04" />
        <stop offset="100%" stopColor="#164e63" stopOpacity="0" />
      </radialGradient>

      <linearGradient
        id="matrixSweepGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor="#00ff9f" stopOpacity="0" />
        <stop offset="60%" stopColor="#00ff9f" stopOpacity="0.55" />
        <stop offset="80%" stopColor="#06b6d4" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
      </linearGradient>

      <linearGradient
        id="cyberProgressGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor="rgba(0,0,0,0.12)" />
        <stop offset="25%" stopColor="rgba(0,0,0,0.18)" />
        <stop offset="75%" stopColor="rgba(0,0,0,0.22)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.14)" />
      </linearGradient>

      <linearGradient
        id="matrixGridGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
      </linearGradient>

      <filter
        id="clientGlow"
        x="-50%"
        y="-50%"
        width="300%"
        height="300%"
      >
        <feGaussianBlur stdDeviation="1" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <circle cx="100" cy="100" r="90" fill="url(#cyberRadarGlow)" className="radar-glow" />

    {[20, 40, 60, 80, 90].map((radius, index) => (
      <circle
        key={radius}
        cx="100"
        cy="100"
        r={radius}
        fill={index === 4 ? "rgba(0,0,0,0.08)" : "none"}
        stroke={
          index === 4
            ? "url(#cyberProgressGradient)"
            : "rgba(6,182,212,0.16)"
        }
        strokeWidth={index === 4 ? "2.4" : index === 0 ? "1.6" : "1"}
        opacity={index === 4 ? "0.88" : index === 0 ? "0.45" : "0.28"}
        strokeDasharray={
          index % 2 === 0 ? "none" : index === 1 ? "4,4" : "2,2"
        }
        className="radar-ring"
      />
    ))}

    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
      const radian = (angle * Math.PI) / 180;
      const x1 = 100 + 15 * Math.cos(radian);
      const y1 = 100 + 15 * Math.sin(radian);
      const x2 = 100 + 90 * Math.cos(radian);
      const y2 = 100 + 90 * Math.sin(radian);

      return (
        <line
          key={angle}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="url(#matrixGridGradient)"
          strokeWidth="0.9"
          opacity="0.32"
          className="radar-line"
        />
      );
    })}

    <line
      x1="100"
      y1="100"
      x2="100"
      y2="10"
      stroke="url(#matrixSweepGradient)"
      strokeWidth="4"
      opacity="0.95"
      className="radar-sweep-main"
    />

    <line
      x1="100"
      y1="100"
      x2="100"
      y2="25"
      stroke="#00ff9f"
      strokeWidth="3"
      opacity="0.5"
      className="radar-sweep-secondary"
    />

    <line
      x1="100"
      y1="100"
      x2="100"
      y2="15"
      stroke="#ff0080"
      strokeWidth="2"
      opacity="0.32"
      className="radar-sweep-tertiary"
    />

    <path
      d="M 100 100 L 100 10 A 90 90 0 0 1 163.64 136.36 Z"
      fill="url(#matrixSweepGradient)"
      opacity="0.10"
      className="radar-sweep-path"
    />

    <circle cx="100" cy="100" r="5" fill="#01ffdb" className="radar-center" />
  </>
));

// Separate component for radar dots to optimize rendering
const RadarDots = React.memo(({ dots }) => {
  return dots.map((dot) => (
    <circle
      key={dot.id}
      cx={dot.x}
      cy={dot.y}
      r="1"
      fill="#d60d43"
      opacity={dot.base}
      filter="url(#clientGlow)"
    >
      <animate
        attributeName="opacity"
        values={`${dot.base};${Math.min(dot.base + 0.3, 1)};${dot.base}`}
        dur="2s"
        begin={`${dot.delay}s`}
        repeatCount="indefinite"
      />
      <animate
        attributeName="r"
        values="0.5;1.5;0.5"
        dur="3s"
        begin={`${dot.delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  ));
});

const RadarComponent = ({ clientCount = 0 }) => {
  // Persistent seed so blips stay stable per session
  const seedRef = React.useRef(Math.floor(Date.now() % 2147483647));

  // Mulberry32 PRNG (stable, memoized)
  const mulberry32 = React.useCallback((seed) => {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }, []);

  // Cache for generated client dots keyed by 'cap' (number of dots)
  const dotsCache = React.useRef(new Map());

  // Generate radar blips with caching and a hard cap for performance
  const generateClientDots = React.useCallback(
    (count) => {
      const cap = Math.min(Math.max(count, 0), 50);
      if (dotsCache.current.has(cap)) return dotsCache.current.get(cap);

      const dots = [];
      const rng = mulberry32(seedRef.current ^ (cap + 1));

      for (let i = 0; i < cap; i++) {
        const r = 10 + rng() * 78;
        const theta = rng() * Math.PI * 2;
        const x = 100 + r * Math.cos(theta);
        const y = 100 + r * Math.sin(theta);
        const base = 0.22 + rng() * 0.45;
        const delay = rng() * 4;
        const pulse = 1 + rng() * 0.8;
        dots.push({
          id: `b-${i}-${Math.round(x * 10)}-${Math.round(y * 10)}`,
          x,
          y,
          base,
          delay,
          pulse,
        });
      }

      dotsCache.current.set(cap, dots);
      return dots;
    },
    [mulberry32]
  );

  // Memoize generated dots so they only recompute when clientCount changes
  const clientDots = React.useMemo(
    () => generateClientDots(clientCount),
    [clientCount, generateClientDots]
  );

  return (
    <div className="w-full mt-6">
      {/* Glass container */}
      <div
        className="relative overflow-hidden rounded-2xl p-4 lg:p-6
                  backdrop-blur-xl
                    border border-emerald-400/18"
      >
        {/* Header with count */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <h3 className="text-emerald-400 font-bold text-lg flex items-center gap-2 font-mono">
            <Target className="w-5 h-5 text-emerald-300 drop-shadow-lg" />
            <span className="hidden sm:inline bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent glitch-text">
              [CLIENT_RADAR]
            </span>
            <span className="sm:hidden bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent glitch-text">
              [RADAR]
            </span>
          </h3>
          <div className="text-right">
            <div className="text-3xl font-extrabold font-mono bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
              {clientCount}
            </div>
            <div className="text-xs text-emerald-400/70 font-mono tracking-wide">
              [ACTIVE_CLIENTS]
            </div>
          </div>
        </div>

        {/* RADAR */}
        <div className="relative w-full max-w-sm mx-auto aspect-square">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            <RadarStaticElements />
            <RadarDots dots={clientDots} />
          </svg>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .glitch-text {
          position: relative;
          animation: glitch 3s linear infinite;
        }
        
        .radar-glow {
          animation: radarGlow 2.2s ease-in-out infinite;
        }
        
        .radar-ring {
          animation: radarRingPulse 3s ease-in-out infinite;
        }
        
        .radar-line {
          animation: radarLinePulse 4s ease-in-out infinite;
        }
        
        .radar-sweep-main {
          transform-origin: 100px 100px;
          animation: radarSweepMain 3s linear infinite;
        }
        
        .radar-sweep-secondary {
          transform-origin: 100px 100px;
          animation: radarSweepSecondary 2s linear infinite;
        }
        
        .radar-sweep-tertiary {
          transform-origin: 100px 100px;
          animation: radarSweepTertiary 1.5s linear infinite;
        }
        
        .radar-sweep-path {
          transform-origin: 100px 100px;
          animation: radarSweepMain 3s linear infinite;
        }
        
        .radar-center {
          animation: radarCenterPulse 1.5s ease-in-out infinite;
        }
        
        @keyframes glitch {
          2%, 64% {
            transform: translate(1px, 0) skew(0deg);
          }
          4%, 60% {
            transform: translate(-1px, 0) skew(0deg);
          }
          62% {
            transform: translate(0, 0) skew(1.5deg);
          }
        }
        
        @keyframes radarGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.85; }
        }
        
        @keyframes radarRingPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes radarLinePulse {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.5; }
        }
        
        @keyframes radarSweepMain {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes radarSweepSecondary {
          0% { transform: rotate(120deg); }
          100% { transform: rotate(480deg); }
        }
        
        @keyframes radarSweepTertiary {
          0% { transform: rotate(240deg); }
          100% { transform: rotate(600deg); }
        }
        
        @keyframes radarCenterPulse {
          0%, 100% { r: 4px; }
          50% { r: 7px; }
        }
      `}</style>
    </div>
  );
};

export default React.memo(
  RadarComponent,
  (prev, next) => prev.clientCount === next.clientCount
);