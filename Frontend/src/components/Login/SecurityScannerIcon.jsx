import React from "react";

const SecurityScannerIcon = ({ className = "", size = 140 }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Main security scanner device */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#01ffdb] drop-shadow-[0_0_15px_rgba(1,255,219,0.6)]"
      >
        {/* Outer scanner frame */}
        <rect
          x="15"
          y="15"
          width="70"
          height="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          rx="8"
        />

        {/* Inner scanner screen */}
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          fill="rgba(1, 255, 219, 0.1)"
          stroke="currentColor"
          strokeWidth="1.5"
          rx="4"
        />

        {/* Scanner grid pattern */}
        <g stroke="currentColor" strokeWidth="0.5" opacity="0.6">
          <line x1="30" y1="20" x2="30" y2="80" />
          <line x1="40" y1="20" x2="40" y2="80" />
          <line x1="50" y1="20" x2="50" y2="80" />
          <line x1="60" y1="20" x2="60" y2="80" />
          <line x1="70" y1="20" x2="70" y2="80" />

          <line x1="20" y1="30" x2="80" y2="30" />
          <line x1="20" y1="40" x2="80" y2="40" />
          <line x1="20" y1="50" x2="80" y2="50" />
          <line x1="20" y1="60" x2="80" y2="60" />
          <line x1="20" y1="70" x2="80" y2="70" />
        </g>

        {/* Central security symbol */}
        <g transform="translate(50, 50)">
          {/* Shield outline */}
          <path
            d="M-8,-12 L8,-12 L8,0 L0,8 L-8,0 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />

          {/* Lock symbol inside shield */}
          <rect
            x="-3"
            y="-4"
            width="6"
            height="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M-2,-6 Q-2,-8 0,-8 Q2,-8 2,-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="0" cy="-1" r="1" fill="currentColor" />
        </g>

        {/* Corner indicators */}
        <g stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M10,15 L10,10 L15,10" />
          <path d="M85,10 L90,10 L90,15" />
          <path d="M90,85 L90,90 L85,90" />
          <path d="M15,90 L10,90 L10,85" />
        </g>

        {/* Status indicators */}
        <circle cx="25" cy="12" r="1.5" fill="currentColor" opacity="0.8">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="30" cy="12" r="1.5" fill="currentColor" opacity="0.6">
          <animate
            attributeName="opacity"
            values="0.2;0.8;0.2"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="35" cy="12" r="1.5" fill="currentColor" opacity="0.4">
          <animate
            attributeName="opacity"
            values="0.1;0.6;0.1"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Data streams */}
        <g stroke="currentColor" strokeWidth="1" opacity="0.7">
          <line x1="85" y1="25" x2="92" y2="25">
            <animate
              attributeName="x2"
              values="85;95;85"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="85" y1="30" x2="90" y2="30">
            <animate
              attributeName="x2"
              values="85;93;85"
              dur="2s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="85" y1="35" x2="88" y2="35">
            <animate
              attributeName="x2"
              values="85;91;85"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </line>
        </g>
      </svg>

      {/* Horizontal scanning line */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[#01ffdb] to-transparent opacity-90"
          style={{
            animation: "scan 3s ease-in-out infinite",
            top: "20%",
          }}
        />
      </div>

      {/* Vertical scanning line */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-[#01ffdb] to-transparent opacity-60"
          style={{
            animation: "scanVertical 4s ease-in-out infinite",
            left: "25%",
          }}
        />
      </div>

      {/* Pulsing outer glow */}
      <div
        className="absolute inset-0 bg-[#01ffdb]/10 rounded-lg animate-ping"
        style={{ animationDuration: "2s" }}
      />

      {/* Rotating scanner beam */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#01ffdb]/80 to-transparent origin-center"
          style={{
            animation: "rotate 6s linear infinite",
            transformOrigin: "center",
          }}
        />
      </div>
    </div>
  );
};

export default SecurityScannerIcon;
