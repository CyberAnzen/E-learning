import React from "react";

export const CircuitPattern = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer ring */}
    <circle
      cx="200"
      cy="200"
      r="180"
      stroke="#00B3A0"
      strokeWidth="2"
      fill="none"
      opacity="0.6"
    />
    <circle
      cx="200"
      cy="200"
      r="160"
      stroke="#00B3A0"
      strokeWidth="1"
      fill="none"
      opacity="0.4"
    />

    {/* Inner circles */}
    <circle
      cx="200"
      cy="200"
      r="120"
      stroke="#00D1C6"
      strokeWidth="2"
      fill="none"
    />
    <circle
      cx="200"
      cy="200"
      r="80"
      stroke="#00B3A0"
      strokeWidth="1"
      fill="none"
      opacity="0.8"
    />
    <circle
      cx="200"
      cy="200"
      r="40"
      stroke="#00D1C6"
      strokeWidth="2"
      fill="none"
    />

    {/* Crosshairs */}
    <line
      x1="20"
      y1="200"
      x2="380"
      y2="200"
      stroke="#00B3A0"
      strokeWidth="1"
      opacity="0.5"
    />
    <line
      x1="200"
      y1="20"
      x2="200"
      y2="380"
      stroke="#00B3A0"
      strokeWidth="1"
      opacity="0.5"
    />

    {/* Corner brackets */}
    <path
      d="M50 50 L50 80 L80 80"
      stroke="#00D1C6"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M350 50 L350 80 L320 80"
      stroke="#00D1C6"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M50 350 L50 320 L80 320"
      stroke="#00D1C6"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M350 350 L350 320 L320 320"
      stroke="#00D1C6"
      strokeWidth="2"
      fill="none"
    />

    {/* Rotating elements */}
    <g
      className="animate-spin"
      style={{ transformOrigin: "200px 200px", animationDuration: "20s" }}
    >
      <circle cx="200" cy="80" r="8" fill="#00B3A0" />
      <circle cx="320" cy="200" r="8" fill="#00D1C6" />
      <circle cx="200" cy="320" r="8" fill="#00B3A0" />
      <circle cx="80" cy="200" r="8" fill="#00D1C6" />
    </g>

    {/* Circuit lines */}
    <path
      d="M200 40 L200 80 L240 80 L240 120"
      stroke="#00B3A0"
      strokeWidth="1"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M360 200 L320 200 L320 160 L280 160"
      stroke="#00D1C6"
      strokeWidth="1"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M200 360 L200 320 L160 320 L160 280"
      stroke="#00B3A0"
      strokeWidth="1"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M40 200 L80 200 L80 240 L120 240"
      stroke="#00D1C6"
      strokeWidth="1"
      fill="none"
      opacity="0.7"
    />
  </svg>
);

export const HexagonalFrame = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 600 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main hexagonal frame */}
    <path
      d="M50 100 L150 50 L450 50 L550 100 L550 300 L450 350 L150 350 L50 300 Z"
      stroke="#00B3A0"
      strokeWidth="3"
      fill="rgba(0,179,160,0.05)"
    />

    {/* Inner frame */}
    <path
      d="M70 110 L160 70 L440 70 L530 110 L530 290 L440 330 L160 330 L70 290 Z"
      stroke="#00D1C6"
      strokeWidth="2"
      fill="none"
      opacity="0.8"
    />

    {/* Corner details */}
    <path
      d="M50 100 L80 100 L80 130"
      stroke="#00B3A0"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M550 100 L520 100 L520 130"
      stroke="#00B3A0"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M50 300 L80 300 L80 270"
      stroke="#00B3A0"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M550 300 L520 300 L520 270"
      stroke="#00B3A0"
      strokeWidth="2"
      fill="none"
    />

    {/* Tech details */}
    <rect x="100" y="80" width="20" height="4" fill="#00D1C6" />
    <rect x="130" y="80" width="10" height="4" fill="#00B3A0" />
    <rect x="480" y="80" width="20" height="4" fill="#00D1C6" />
    <rect x="460" y="80" width="10" height="4" fill="#00B3A0" />

    {/* Circuit patterns */}
    <path
      d="M100 120 L120 120 L120 140 L140 140"
      stroke="#00B3A0"
      strokeWidth="1"
      opacity="0.6"
    />
    <path
      d="M500 120 L480 120 L480 140 L460 140"
      stroke="#00D1C6"
      strokeWidth="1"
      opacity="0.6"
    />
    <path
      d="M100 280 L120 280 L120 260 L140 260"
      stroke="#00B3A0"
      strokeWidth="1"
      opacity="0.6"
    />
    <path
      d="M500 280 L480 280 L480 260 L460 260"
      stroke="#00D1C6"
      strokeWidth="1"
      opacity="0.6"
    />
  </svg>
);

export const TechGrid = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Grid pattern */}
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M 20 0 L 0 0 0 20"
          fill="none"
          stroke="#00B3A0"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </pattern>
    </defs>
    <rect width="200" height="200" fill="url(#grid)" />

    {/* Highlighted sections */}
    <rect
      x="40"
      y="40"
      width="40"
      height="40"
      fill="rgba(0,179,160,0.1)"
      stroke="#00B3A0"
      strokeWidth="1"
    />
    <rect
      x="120"
      y="120"
      width="40"
      height="40"
      fill="rgba(0,209,198,0.1)"
      stroke="#00D1C6"
      strokeWidth="1"
    />

    {/* Connection points */}
    <circle cx="60" cy="60" r="3" fill="#00B3A0" />
    <circle cx="140" cy="140" r="3" fill="#00D1C6" />
    <circle cx="60" cy="140" r="2" fill="#00B3A0" opacity="0.7" />
    <circle cx="140" cy="60" r="2" fill="#00D1C6" opacity="0.7" />
  </svg>
);

export const DataStream = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 300 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Data flow lines */}
    <path
      d="M0 50 Q75 20 150 50 T300 50"
      stroke="#00B3A0"
      strokeWidth="2"
      fill="none"
      opacity="0.8"
    >
      <animate
        attributeName="stroke-dasharray"
        values="0,300;150,150;300,0"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M0 30 Q75 10 150 30 T300 30"
      stroke="#00D1C6"
      strokeWidth="1"
      fill="none"
      opacity="0.6"
    >
      <animate
        attributeName="stroke-dasharray"
        values="0,300;100,200;300,0"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M0 70 Q75 90 150 70 T300 70"
      stroke="#00B3A0"
      strokeWidth="1"
      fill="none"
      opacity="0.4"
    >
      <animate
        attributeName="stroke-dasharray"
        values="0,300;200,100;300,0"
        dur="4s"
        repeatCount="indefinite"
      />
    </path>

    {/* Data nodes */}
    <circle cx="75" cy="50" r="4" fill="#00B3A0">
      <animate
        attributeName="opacity"
        values="0.3;1;0.3"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="225" cy="50" r="4" fill="#00D1C6">
      <animate
        attributeName="opacity"
        values="1;0.3;1"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export const HolographicDisplay = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Holographic frame */}
    <path
      d="M20 20 L380 20 L360 40 L40 40 Z"
      fill="rgba(0,179,160,0.1)"
      stroke="#00B3A0"
      strokeWidth="1"
    />
    <path
      d="M20 280 L380 280 L360 260 L40 260 Z"
      fill="rgba(0,179,160,0.1)"
      stroke="#00B3A0"
      strokeWidth="1"
    />
    <path
      d="M20 20 L20 280 L40 260 L40 40 Z"
      fill="rgba(0,209,198,0.1)"
      stroke="#00D1C6"
      strokeWidth="1"
    />
    <path
      d="M380 20 L380 280 L360 260 L360 40 Z"
      fill="rgba(0,209,198,0.1)"
      stroke="#00D1C6"
      strokeWidth="1"
    />

    {/* Scan lines */}
    <g opacity="0.3">
      {Array.from({ length: 15 }, (_, i) => (
        <line
          key={i}
          x1="40"
          y1={40 + i * 15}
          x2="360"
          y2={40 + i * 15}
          stroke="#00B3A0"
          strokeWidth="0.5"
        />
      ))}
    </g>

    {/* Holographic elements */}
    <circle
      cx="200"
      cy="150"
      r="60"
      stroke="#00D1C6"
      strokeWidth="2"
      fill="none"
      opacity="0.7"
    >
      <animate
        attributeName="r"
        values="60;70;60"
        dur="3s"
        repeatCount="indefinite"
      />
    </circle>
    <circle
      cx="200"
      cy="150"
      r="40"
      stroke="#00B3A0"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    >
      <animate
        attributeName="r"
        values="40;35;40"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Data points */}
    <circle cx="150" cy="100" r="3" fill="#00B3A0">
      <animate
        attributeName="opacity"
        values="0.5;1;0.5"
        dur="1.5s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="250" cy="200" r="3" fill="#00D1C6">
      <animate
        attributeName="opacity"
        values="1;0.5;1"
        dur="1.8s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="120" cy="180" r="2" fill="#00B3A0">
      <animate
        attributeName="opacity"
        values="0.3;0.8;0.3"
        dur="2.2s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);
