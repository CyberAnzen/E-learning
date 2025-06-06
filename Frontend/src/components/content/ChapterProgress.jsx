import React from "react";
import { CheckCircle } from "lucide-react";

const ChapterProgress = ({ overallProgress, tasks, currentTaskId }) => {
  return (
    <div className="w-full lg:w-5/12 order-1 lg:order-2">
      <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 sticky top-24">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          Chapter Progress
        </h3>

        {/* Progress Circle */}
        <div className="relative w-52 h-52 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#374151"
              strokeWidth="8"
            />
            {/* Progress arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10B981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="282.743"
              strokeDashoffset={
                282.743 * (1 - overallProgress.percentage / 100)
              }
              transform="rotate(-90 50 50)"
            />
          </svg>

          {/* Progress text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#01ffdb]">
              {overallProgress.percentage}%
            </span>
            <span className="text-gray-400 text-sm mt-1">Completed</span>
          </div>
        </div>

        {/* Progress details */}
        <div className="mt-4 text-center">
          <p className="text-gray-300">
            {overallProgress.completed} of {overallProgress.total} tasks
            completed
          </p>

          {/* Task list */}
          <div className="mt-6 max-h-60 overflow-y-auto scrollbar-custom">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
                  task.id === currentTaskId
                    ? "bg-gray-700/50 border border-green-400/30"
                    : "bg-gray-800/20"
                }`}
              >
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-gray-500 flex-shrink-0" />
                )}
                <span
                  className={`text-sm truncate ${
                    task.completed ? "text-white" : "text-gray-400"
                  }`}
                >
                  {task.title}
                </span>
                {task.id === currentTaskId && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterProgress;
