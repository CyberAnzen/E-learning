import React from "react";

const KeyIcon = ({ className = "", size = 140 }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Main key SVG using the provided design */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 400 475"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#01ffdb] drop-shadow-[0_0_15px_rgba(1,255,219,0.6)]"
      >
        {/* Main key path from provided SVG */}
        <path
          d="M189.610 4.225 C 156.978 20.878,122.160 34.942,93.878 42.896 C 75.909 47.949,56.585 51.706,13.605 58.501 C 4.405 59.956,2.298 60.363,0.867 60.961 L 0.000 61.323 0.001 71.045 C 0.004 87.781,2.560 143.890,4.462 168.955 C 6.132 190.957,6.676 195.961,8.321 204.453 C 15.727 242.669,24.282 271.419,37.654 303.030 C 50.003 332.224,78.065 375.428,100.316 399.505 C 107.044 406.785,118.626 418.338,122.820 421.951 C 136.586 433.812,153.582 448.013,159.060 452.230 C 161.996 454.491,164.001 455.793,170.810 459.864 C 174.075 461.816,178.417 464.494,180.458 465.814 C 186.778 469.904,197.388 474.954,199.659 474.954 C 201.596 474.954,214.266 468.998,219.419 465.666 C 220.711 464.830,225.220 462.057,229.437 459.502 C 240.528 452.786,246.003 448.564,266.172 431.174 C 270.049 427.830,274.780 423.763,276.685 422.134 C 284.045 415.841,304.176 394.836,310.106 387.260 C 322.113 371.921,332.345 357.150,341.377 342.115 C 357.859 314.678,365.340 298.473,375.918 267.285 C 382.661 247.408,391.241 210.109,393.560 190.600 C 396.046 169.677,399.647 100.548,399.822 70.390 L 399.876 61.002 398.887 60.794 C 392.150 59.378,378.991 57.027,369.450 55.536 C 325.914 48.731,307.235 44.148,273.346 31.954 C 259.134 26.841,232.006 14.833,211.566 4.609 L 202.353 0.000 200.063 0.030 L 197.774 0.060 189.610 4.225 M210.771 23.629 C 231.509 34.002,256.313 44.840,272.480 50.594 C 300.708 60.641,318.915 64.987,358.936 71.232 C 367.136 72.512,375.430 73.995,383.395 75.607 L 385.466 76.026 385.301 83.715 C 384.638 114.720,382.303 163.204,380.440 184.663 C 378.906 202.334,376.727 214.506,370.715 239.001 C 359.291 285.545,342.224 322.258,313.593 361.876 C 301.021 379.272,294.564 386.773,278.629 402.492 C 271.742 409.285,252.337 425.953,239.456 436.141 C 236.263 438.666,235.279 439.311,226.592 444.580 C 222.443 447.097,218.170 449.729,217.097 450.430 C 213.962 452.476,202.695 457.740,200.786 458.049 C 198.875 458.360,189.506 453.999,182.965 449.756 C 180.906 448.420,177.273 446.177,174.892 444.772 C 166.549 439.848,164.672 438.516,155.642 431.114 C 151.170 427.448,133.500 412.523,129.375 408.929 C 124.958 405.079,114.624 394.635,106.221 385.529 C 96.847 375.369,81.791 354.606,71.781 338.033 C 66.210 328.810,65.186 327.073,61.789 321.088 C 47.509 295.933,34.591 259.201,26.381 220.408 C 22.546 202.287,22.526 202.161,21.401 188.868 C 19.636 168.007,19.116 159.542,17.574 126.531 C 16.400 101.412,16.249 96.900,16.225 86.211 L 16.203 76.071 17.184 75.748 C 18.282 75.388,21.755 74.778,32.282 73.098 C 78.358 65.745,91.860 62.872,115.328 55.426 C 137.323 48.447,163.587 37.448,189.858 24.213 L 199.011 19.602 200.805 19.572 L 202.600 19.542 210.771 23.629 M188.868 36.714 C 155.488 53.615,126.279 65.076,99.938 71.609 C 85.608 75.163,77.636 76.672,45.055 81.999 C 30.860 84.320,30.222 84.440,28.979 85.030 L 28.126 85.435 28.296 94.851 C 28.643 114.075,30.744 159.417,32.165 178.355 C 33.880 201.206,34.170 203.574,36.859 216.735 C 39.649 230.382,40.237 232.899,43.819 246.506 C 50.879 273.326,60.916 299.102,71.850 318.491 C 94.425 358.525,113.212 381.965,143.774 408.230 C 163.297 425.008,166.361 427.426,173.849 431.963 C 176.609 433.635,180.643 436.148,182.814 437.548 C 189.965 442.161,198.841 446.360,200.421 445.879 C 203.336 444.992,213.515 440.068,216.327 438.185 C 217.551 437.364,221.336 434.989,224.737 432.905 C 228.139 430.822,231.422 428.782,232.035 428.372 C 236.378 425.463,249.922 414.090,267.296 398.759 C 269.985 396.386,278.584 387.619,284.882 380.829 C 299.071 365.532,313.215 345.237,328.670 317.996 C 336.191 304.742,342.866 289.346,349.908 269.017 C 356.795 249.137,364.358 216.557,366.590 197.155 C 368.703 178.798,371.738 119.101,371.879 93.142 L 371.923 84.984 364.131 83.447 C 359.845 82.601,352.387 81.285,347.557 80.523 C 310.370 74.652,293.227 70.505,266.790 60.985 C 252.140 55.709,227.364 44.702,209.106 35.359 C 199.435 30.409,201.608 30.264,188.868 36.714"
          fill="currentColor"
          stroke="none"
        />

        {/* Security scanning grid overlay */}
        <g stroke="currentColor" strokeWidth="1" opacity="0.3">
          {/* Horizontal grid lines */}
          <line x1="20" y1="80" x2="380" y2="80" />
          <line x1="20" y1="120" x2="380" y2="120" />
          <line x1="20" y1="160" x2="380" y2="160" />
          <line x1="20" y1="200" x2="380" y2="200" />
          <line x1="20" y1="240" x2="380" y2="240" />
          <line x1="20" y1="280" x2="380" y2="280" />
          <line x1="20" y1="320" x2="380" y2="320" />
          <line x1="20" y1="360" x2="380" y2="360" />
          <line x1="20" y1="400" x2="380" y2="400" />

          {/* Vertical grid lines */}
          <line x1="60" y1="40" x2="60" y2="440" />
          <line x1="100" y1="40" x2="100" y2="440" />
          <line x1="140" y1="40" x2="140" y2="440" />
          <line x1="180" y1="40" x2="180" y2="440" />
          <line x1="220" y1="40" x2="220" y2="440" />
          <line x1="260" y1="40" x2="260" y2="440" />
          <line x1="300" y1="40" x2="300" y2="440" />
          <line x1="340" y1="40" x2="340" y2="440" />
        </g>

        {/* Security verification points with animation */}
        <circle
          cx="200"
          cy="120"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.8"
        >
          <animate
            attributeName="r"
            values="4;8;4"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.3;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          cx="150"
          cy="200"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.6"
        >
          <animate
            attributeName="r"
            values="3;6;3"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0.2;0.6"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          cx="250"
          cy="280"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.7"
        >
          <animate
            attributeName="r"
            values="3;7;3"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.7;0.2;0.7"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          cx="200"
          cy="350"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.5"
        >
          <animate
            attributeName="r"
            values="4;9;4"
            dur="2.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0.1;0.5"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Data stream lines */}
        <g stroke="currentColor" strokeWidth="2" opacity="0.6">
          <line x1="350" y1="100" x2="380" y2="100">
            <animate
              attributeName="x2"
              values="350;390;350"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="350" y1="140" x2="375" y2="140">
            <animate
              attributeName="x2"
              values="350;385;350"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="350" y1="180" x2="370" y2="180">
            <animate
              attributeName="x2"
              values="350;380;350"
              dur="2s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="350" y1="220" x2="378" y2="220">
            <animate
              attributeName="x2"
              values="350;388;350"
              dur="1.9s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="350" y1="260" x2="382" y2="260">
            <animate
              attributeName="x2"
              values="350;392;350"
              dur="2.1s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="350" y1="300" x2="376" y2="300">
            <animate
              attributeName="x2"
              values="350;386;350"
              dur="1.7s"
              repeatCount="indefinite"
            />
          </line>
        </g>

        {/* Security analysis points */}
        <g fill="currentColor" opacity="0.4">
          <circle cx="100" cy="150" r="1.5">
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="120" cy="180" r="1.5">
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="280" cy="160" r="1.5">
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="300" cy="200" r="1.5">
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="2.1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="180" cy="320" r="1.5">
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="1.6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="220" cy="340" r="1.5">
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="1.9s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>

      {/* Primary horizontal scanning line */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#01ffdb] to-transparent opacity-90"
          style={{
            animation: "scan 3s ease-in-out infinite",
            top: "20%",
          }}
        />
      </div>

      {/* Secondary horizontal scanning line */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[#01ffdb]/70 to-transparent opacity-70"
          style={{
            animation: "scan 3s ease-in-out infinite 1.5s",
            top: "70%",
          }}
        />
      </div>

      {/* Vertical scanning line */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-[#01ffdb]/80 to-transparent opacity-60"
          style={{
            animation: "scanVertical 4s ease-in-out infinite",
            left: "25%",
          }}
        />
      </div>

      {/* Key authentication scanner beam */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-24 h-0.5 bg-gradient-to-r from-[#01ffdb]/20 via-[#01ffdb]/90 to-[#01ffdb]/20 origin-center"
          style={{
            animation: "rotate 8s linear infinite",
            transformOrigin: "center",
          }}
        />
      </div>

      {/* Pulsing outer glow */}
      <div
        className="absolute inset-0 bg-[#01ffdb]/10 rounded-lg animate-ping"
        style={{ animationDuration: "2s" }}
      />

      {/* Security verification overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#01ffdb]/50 to-transparent opacity-50"
          style={{
            animation: "scan 2s ease-in-out infinite reverse",
            top: "50%",
          }}
        />
      </div>

      {/* Corner scanning indicators */}
      <div className="absolute top-2 right-2">
        <div className="w-2 h-2 border-t-2 border-r-2 border-[#01ffdb] animate-pulse" />
      </div>
      <div className="absolute bottom-2 left-2">
        <div className="w-2 h-2 border-b-2 border-l-2 border-[#01ffdb] animate-pulse" />
      </div>
      <div className="absolute bottom-2 right-2">
        <div className="w-2 h-2 border-b-2 border-r-2 border-[#01ffdb] animate-pulse" />
      </div>
    </div>
  );
};

export default React.memo(KeyIcon);
