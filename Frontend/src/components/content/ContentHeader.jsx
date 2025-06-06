import React, { useEffect, useState } from "react";
import { Clock, User, Target } from "lucide-react";

const ContentHeader = ({ currentChapter, scrolled, taskProgress }) => {
  // ─── Live‐updating time ─────────────────────────────────────────────────────
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ─── Keyframes for shimmer animation ──────────────────────────────────── */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className={` bg-black/20 p-5 border-b border-gray-800 `}>
        <div className="flex flex-wrap items-center gap-2 mb-3 text-base sm:text-lg md:text-xl font-semibold text-green-400">
          <span className="text-green-500">
            {currentChapter.content.author}@kali
          </span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white">$</span>
          <span className="text-green-300">{currentChapter.chapter}</span>
          <span className="animate-pulse text-green-500">▍</span>
        </div>

        <div className="flex flex-wrap gap-6 text-gray-400 text-xs sm:text-sm pl-4 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-white" />
            <span>User: {currentChapter.content.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <span>Duration: {currentChapter.content.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-white" />
            <span>Difficulty: Medium</span>
          </div>
        </div>

        <div className="pl-4 text-green-500 text-xs sm:text-sm">
          Last login: {currentTime.toLocaleString()} on tty1
        </div>
        <div className="pl-4 mt-4 text-green-500 text-xs sm:text-sm">
          $ sudo system-update
        </div>
        <div className="pl-4 mt-2 text-white text-xs sm:text-sm">
          Updating system...
        </div>
        <div className="pl-4 mt-2">
          <div className="relative h-4 bg-gray-800 overflow-hidden shadow-inner w-full">
            {/* Filled portion */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-green-500 to-green-700 transition-all duration-700 ease-in-out"
              style={{ width: `${taskProgress}%` }}
            />

            {/* Shimmer overlay on filled portion */}
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${taskProgress}%` }}
            >
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>

            {/* Glowing pulse at right edge */}
            <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-r from-transparent via-green-400/30 to-green-500/10 blur-sm pointer-events-none animate-pulse" />

            {/* Percentage text */}
            <span className="absolute left-1/2 top-1/2 text-[11px] font-semibold text-white transform -translate-x-1/2 -translate-y-1/2">
              {taskProgress}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentHeader;
