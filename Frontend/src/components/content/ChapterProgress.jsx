import React from "react";
import { CheckCircle, Circle, Target } from "lucide-react";



const RadarProgress= ({ 
  overallProgress, 
  tasks, 
  currentTaskId 
}) => {
  // Calculate positions for tasks around the circle
  const getTaskPosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const radius = 85; // Radius for task positioning
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y, angle };
  };

  return (
    <div className="w-full lg:w-5/12 order-1 lg:order-2">
      <div className="bg-gray-900/40 rounded-2xl p-4 lg:p-6 backdrop-blur-md border border-gray-700/30 sticky top-20 lg:top-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="hidden sm:inline">Mission Progress</span>
            <span className="sm:hidden">Progress</span>
          </h3>
          <div className="text-right">
            <div className="text-2xl lg:text-3xl font-bold text-emerald-400">
              {overallProgress.percentage}%
            </div>
            <div className="text-xs text-gray-400">
              {overallProgress.completed}/{overallProgress.total}
            </div>
          </div>
        </div>

        {/* Radar Container */}
        <div className="relative w-full max-w-sm mx-auto aspect-square ">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Radar Background Circles */}
            <defs>
              <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
            </defs>
            
            {/* Background glow */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="url(#radarGlow)"
            />
            
            {/* Concentric circles */}
            {[30, 60, 90].map((radius) => (
              <circle
                key={radius}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#374151"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}

            {/* Radar grid lines */}
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
                  stroke="#374151"
                  strokeWidth="1"
                  opacity="0.2"
                />
              );
            })}

            {/* Progress Arc */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="565.48"
              strokeDashoffset={565.48 * (1 - overallProgress.percentage / 100)}
              transform="rotate(-90 100 100)"
              className="transition-all duration-1000 ease-out"
            />

            {/* Radar Sweep Animation */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="10"
              stroke="#10b981"
              strokeWidth="2"
              opacity="0.8"
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
            </line>

            {/* Task Points */}
            {tasks.map((task, index) => {
              const position = getTaskPosition(index, tasks.length);
              const isCompleted = task.completed;
              const isCurrent = task.id === currentTaskId;
              
              return (
                <g key={task.id}>
                  {/* Task point */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={isCurrent ? "6" : "4"}
                    fill={
                      isCompleted 
                        ? "#10b981" 
                        : isCurrent 
                        ? "#06b6d4" 
                        : "#6b7280"
                    }
                    stroke={isCurrent ? "#0891b2" : "transparent"}
                    strokeWidth="2"
                    className={isCurrent ? "animate-pulse" : ""}
                  />
                  
                  {/* Completed task checkmark */}
                  {isCompleted && (
                    <path
                      d={`M ${position.x - 3} ${position.y} L ${position.x - 1} ${position.y + 2} L ${position.x + 3} ${position.y - 2}`}
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  )}

                  {/* Current task pulse ring */}
                  {isCurrent && (
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r="8"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1"
                      opacity="0.5"
                    >
                      <animate
                        attributeName="r"
                        values="6;12;6"
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
                  )}
                </g>
              );
            })}

            {/* Center dot */}
            <circle
              cx="100"
              cy="100"
              r="3"
              fill="#10b981"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Current Task Info */}
        {currentTaskId && (
          <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-xs text-cyan-400 font-medium uppercase tracking-wide">
                Current Task
              </span>
            </div>
            <p className="text-white text-sm">
              {tasks.find(task => task.id === currentTaskId)?.title}
            </p>
          </div>
        )}

        {/* Task Legend (Mobile Optimized) */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-gray-400">Done</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
            <span className="text-gray-400">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <span className="text-gray-400">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarProgress;