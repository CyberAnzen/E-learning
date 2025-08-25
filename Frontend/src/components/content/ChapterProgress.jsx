import React from "react";
import { CheckCircle, Circle, Target } from "lucide-react";

const RadarProgress = ({ overallProgress=0, tasks=["task1"], currentTaskId="id not specified" }) => {
  // Calculate positions for tasks around the circle
  const getTaskPosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const radius = 0; // Radius for task positioning
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y, angle };
  };

  return (
    <div className="w-full lg:w-5/12 order-1 lg:order-2">
      <div className=" bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 rounded-2xl p-4 lg:p-6 backdrop-blur-xl border border-gray-600/30 shadow-2xl sticky top-20 lg:top-24">
        {/* Subtle inner glow */}
        <div className="absolute inset-1 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 rounded-xl pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400 drop-shadow-lg" />
            <span className="hidden sm:inline bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Mission Progress
            </span>
            <span className="sm:hidden bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Progress
            </span>
          </h3>
          <div className="text-right">
            <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
              {overallProgress.percentage}%
            </div>
            <div className="text-xs text-gray-400">
              {overallProgress.completed}/{overallProgress.total}
            </div>
          </div>
        </div>

        {/* Radar Container */}
        <div className="relative w-full max-w-sm mx-auto aspect-square">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            {/* Advanced Gradients and Effects */}
            <defs>
              {/* Radar glow gradient */}
              <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0" />
              </radialGradient>

              {/* Sweep gradient */}
              <linearGradient
                id="sweepGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
              </linearGradient>

              {/* Progress gradient */}
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>

              {/* Grid line gradient */}
              <linearGradient
                id="gridGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#374151" stopOpacity="0" />
                <stop offset="50%" stopColor="#374151" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#374151" stopOpacity="0" />
              </linearGradient>

              {/* Radar sweep filter */}
              <filter
                id="sweepGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Task point glow */}
              <filter
                id="taskGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background glow with pulsing effect */}
            <circle cx="100" cy="100" r="90" fill="url(#radarGlow)">
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Concentric circles with enhanced styling */}
            {[25, 50, 75, 90].map((radius, index) => (
              <circle
                key={radius}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={index === 3 ? "url(#progressGradient)" : "#374151"}
                strokeWidth={index === 3 ? "2" : "1"}
                opacity={index === 3 ? "0.6" : "0.3"}
                strokeDasharray={index % 2 === 0 ? "none" : "2,2"}
              >
                <animate
                  attributeName="opacity"
                  values="0.2;0.5;0.2"
                  dur={`${4 + index}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}

            {/* Enhanced radar grid lines */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
              (angle) => {
                const radian = (angle * Math.PI) / 180;
                const x1 = 100 + 20 * Math.cos(radian);
                const y1 = 100 + 20 * Math.sin(radian);
                const x2 = 100 + 90 * Math.cos(radian);
                const y2 = 100 + 90 * Math.sin(radian);

                return (
                  <line
                    key={angle}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#gridGradient)"
                    strokeWidth="1"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.1;0.4;0.1"
                      dur="6s"
                      begin={`${angle / 30}s`}
                      repeatCount="indefinite"
                    />
                  </line>
                );
              }
            )}

            {/* Progress Arc with enhanced gradient */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="565.48"
              strokeDashoffset={565.48 * (1 - overallProgress.percentage / 100)}
              transform="rotate(-90 100 100)"
              className="transition-all duration-1000 ease-out"
              filter="url(#sweepGlow)"
            />

            {/* Multiple Radar Sweep Animations */}
            {/* Primary sweep */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="10"
              stroke="url(#sweepGradient)"
              strokeWidth="3"
              opacity="0.9"
              transform="rotate(0 100 100)"
              filter="url(#sweepGlow)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 100 100"
                to="360 100 100"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>

            {/* Secondary sweep (faster, more subtle) */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="25"
              stroke="#06b6d4"
              strokeWidth="2"
              opacity="0.4"
              transform="rotate(180 100 100)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="180 100 100"
                to="540 100 100"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </line>

            {/* Radar sweep trail effect */}
            <path
              d="M 100 100 L 100 10 A 90 90 0 0 1 163.64 136.36 Z"
              fill="url(#sweepGradient)"
              opacity="0.1"
              transform="rotate(0 100 100)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 100 100"
                to="360 100 100"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>

            {/* Task Points with enhanced effects */}
            {tasks.map((task, index) => {
              const position = getTaskPosition(index, tasks.length);
              const isCompleted = task.completed;
              const isCurrent = task.id === currentTaskId;

              return (
                <g key={task.id}>
                  {/* Task point with glow */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={isCurrent ? "7" : "5"}
                    fill={
                      isCompleted
                        ? "#10b981"
                        : isCurrent
                        ? "#06b6d4"
                        : "#6b7280"
                    }
                    stroke={
                      isCurrent
                        ? "#0891b2"
                        : isCompleted
                        ? "#059669"
                        : "transparent"
                    }
                    strokeWidth="2"
                    className={isCurrent ? "animate-pulse" : ""}
                    filter="url(#taskGlow)"
                  />

                  {/* Completed task checkmark */}
                  {isCompleted && (
                    <path
                      d={`M ${position.x - 3} ${position.y} L ${
                        position.x - 1
                      } ${position.y + 2} L ${position.x + 3} ${
                        position.y - 2
                      }`}
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      filter="url(#taskGlow)"
                    />
                  )}

                  {/* Current task enhanced pulse rings */}
                  {isCurrent && (
                    <>
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r="10"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="1"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="r"
                          values="7;15;7"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.8;0;0.8"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r="8"
                        fill="none"
                        stroke="#0891b2"
                        strokeWidth="2"
                        opacity="0.4"
                      >
                        <animate
                          attributeName="r"
                          values="5;12;5"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.6;0;0.6"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </>
                  )}

                  {/* Task detection blip */}
                  {(isCompleted || isCurrent) && (
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r="2"
                      fill="#ffffff"
                      opacity="0"
                    >
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="0.5s"
                        begin={`${index * 0.5}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Enhanced center dot with pulsing */}
            <circle
              cx="100"
              cy="100"
              r="4"
              fill="#10b981"
              filter="url(#taskGlow)"
            >
              <animate
                attributeName="r"
                values="3;5;3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Center crosshairs */}
            <g stroke="#10b981" strokeWidth="1" opacity="0.6">
              <line x1="95" y1="100" x2="105" y2="100" />
              <line x1="100" y1="95" x2="100" y2="105" />
            </g>
          </svg>
        </div>

        {/* Current Task Info with glass effect */}
        {currentTaskId && (
          <div className="relative mt-4 p-3 bg-gradient-to-r from-gray-800/40 to-gray-700/30 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-lg"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50"></div>
                <span className="text-xs text-cyan-400 font-medium uppercase tracking-wide">
                  Current Task
                </span>
              </div>
              <p className="text-white text-sm font-medium">
                {tasks.find((task) => task.id === currentTaskId)?.title}
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Task Legend */}
        <div className="relative mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
            <span className="text-gray-300">Done</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50"></div>
            <span className="text-gray-300">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <span className="text-gray-300">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RadarProgress);
