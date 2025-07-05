import React from "react";

const UserIcon = ({ className = "", size = 140 }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Main user SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#01ffdb] drop-shadow-[0_0_10px_rgba(1,255,219,0.5)]"
      >
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          fill="currentColor"
        />
        <path fill="none" d="M0 0h24v24H0z" />
      </svg>

      {/* Scanning animation overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[#01ffdb] to-transparent animate-pulse opacity-80"
          style={{
            animation: "scan 3s ease-in-out infinite",
            top: "15%",
          }}
        />
      </div>

      {/* Pulsing glow effect */}
      <div
        className="absolute inset-0 bg-[#01ffdb]/10 rounded-full animate-ping"
        style={{ animationDuration: "2s" }}
      />
    </div>
  );
};

export default React.memo(UserIcon);
