import React from "react";
import "./Radar.css";

// Module constants (precomputed)
const VIEW_CENTER = 100;
const VIEW_RADIUS = 90;
const RADAR_RINGS = [20, 40, 60, 80, 90];
const RADAR_LINE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const MAX_DOTS = 50;

const RADAR_LINES = RADAR_LINE_ANGLES.map((angle) => {
  const rad = (angle * Math.PI) / 180;
  return {
    angle,
    x1: VIEW_CENTER + 15 * Math.cos(rad),
    y1: VIEW_CENTER + 15 * Math.sin(rad),
    x2: VIEW_CENTER + VIEW_RADIUS * Math.cos(rad),
    y2: VIEW_CENTER + VIEW_RADIUS * Math.sin(rad),
  };
});

// Mulberry32 PRNG
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Static elements (never re-render)
const RadarStaticElements = React.memo(
  () => (
    <g>
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

        <filter id="clientGlow" x="-50%" y="-50%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx={VIEW_CENTER}
        cy={VIEW_CENTER}
        r={VIEW_RADIUS}
        fill="url(#cyberRadarGlow)"
        className="radar-glow"
      />

      <g className="rings">
        {RADAR_RINGS.map((radius, index) => (
          <circle
            key={radius}
            cx={VIEW_CENTER}
            cy={VIEW_CENTER}
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
      </g>

      <g className="grid-lines">
        {RADAR_LINES.map((ln) => (
          <line
            key={ln.angle}
            x1={ln.x1}
            y1={ln.y1}
            x2={ln.x2}
            y2={ln.y2}
            stroke="url(#matrixGridGradient)"
            strokeWidth="0.9"
            opacity="0.32"
            className="radar-line"
          />
        ))}
      </g>

      <g className="sweep-group">
        <line
          x1={VIEW_CENTER}
          y1={VIEW_CENTER}
          x2={VIEW_CENTER}
          y2={10}
          stroke="url(#matrixSweepGradient)"
          strokeWidth="4"
          opacity="0.95"
          className="radar-sweep-main"
        />
        <line
          x1={VIEW_CENTER}
          y1={VIEW_CENTER}
          x2={VIEW_CENTER}
          y2={25}
          stroke="#00ff9f"
          strokeWidth="3"
          opacity="0.5"
          className="radar-sweep-secondary"
        />
        <line
          x1={VIEW_CENTER}
          y1={VIEW_CENTER}
          x2={VIEW_CENTER}
          y2={15}
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
      </g>

      <circle
        cx={VIEW_CENTER}
        cy={VIEW_CENTER}
        r="5"
        fill="#01ffdb"
        className="radar-center"
      />
    </g>
  ),
  () => true
);

// Hook: debounce small bursts
function useDebounced(value, ms = 120) {
  const [deb, setDeb] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDeb(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return deb;
}

const RadarUltraOptimized = ({ clientCount = 0 }) => {
  // stable per-mount seed
  const seedRef = React.useRef(Math.floor(Date.now() % 2147483647));

  // generate MAX_DOTS once per component mount and reuse
  const maxDots = React.useMemo(() => {
    const rng = mulberry32(seedRef.current);
    const arr = new Array(MAX_DOTS);
    for (let i = 0; i < MAX_DOTS; i++) {
      const r = 10 + rng() * 78;
      const theta = rng() * Math.PI * 2;
      const x = VIEW_CENTER + r * Math.cos(theta);
      const y = VIEW_CENTER + r * Math.sin(theta);
      const base = 0.22 + rng() * 0.45;
      const delay = rng() * 4;
      const pulse = 1 + rng() * 0.8;
      // stable id using seed + index
      arr[i] = { id: `s${seedRef.current}-i${i}`, x, y, base, delay, pulse };
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps => run once

  const displayedCount = useDebounced(clientCount, 90);
  const cap = Math.min(Math.max(displayedCount || 0, 0), MAX_DOTS);

  const clientDots = React.useMemo(() => maxDots.slice(0, cap), [maxDots, cap]);

  return (
    <div className="w-full mt-6">
      <div className="relative overflow-hidden rounded-2xl p-4 lg:p-6 backdrop-blur-xl border border-emerald-400/18">
        <div className="radar-count-badge" aria-hidden>
          {clientCount} Players online
        </div>

        <div className="relative w-full max-w-sm mx-auto aspect-square">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-2xl radar-svg"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <RadarStaticElements />
            <g>
              {clientDots.map((dot) => (
                // render circle directly and use transform attribute (less nested DOM)
                <circle
                  key={dot.id}
                  transform={`translate(${dot.x},${dot.y})`}
                  cx="0"
                  cy="0"
                  r="1"
                  fill="#d60d43"
                  opacity={dot.base}
                  filter="url(#clientGlow)"
                  className="radar-dot"
                >
                  <animate
                    attributeName="opacity"
                    values={`${dot.base};${Math.min(dot.base + 0.3, 1)};${
                      dot.base
                    }`}
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
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default React.memo(
  RadarUltraOptimized,
  (a, b) => a.clientCount === b.clientCount
);
