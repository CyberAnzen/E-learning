import React, { useState } from "react";
import { Terminal as TerminalIcon } from "lucide-react";

const TerminalDesign = ({
  ip,
  chapterId,
  chapterPath,
  questions,
  answers,
  taskId,
  onAnswerSubmit,
  isSubmitted = false,
  isFullScreen = false,
  completedSteps = [],
  totalObjectives = 0,
}) => {
  return (
    <div
      className={`max-w-6xl ${
        isFullScreen ? "w-full" : "lg:min-w-full"
      } mx-auto p-6 font-mono`}
    >
      {/* Terminal Window Header */}
      <div className="bg-[#2D2D2D] rounded-t-lg border border-[#3D3D3D]">
        <div className="flex items-center justify-between p-2 border-b border-[#3D3D3D]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TerminalIcon className="w-4 h-4" />
            <span>
              ssh {ip}@chapter_{chapterId}
            </span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      {/* Terminal Content */}
      <div className="bg-[#1E1E1E] p-6 rounded-b-lg border-x border-b border-[#3D3D3D] shadow-xl space-y-6">
        {/* Command Line Header */}
        <div className="flex items-center gap-2 text-green-400">
          <span>$</span>
          <span className="typing-animation">cd {chapterPath}</span>
        </div>

        {/* Task Section */}
        <div className="bg-[#2D2D2D] p-4 rounded border border-[#3D3D3D] space-y-4">
          {/* Questions */}
          <div>
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <span>$</span>
              ./answer_questions.sh
            </div>
            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="bg-[#252525] p-4 rounded border border-[#3D3D3D]"
                >
                  <p className="mb-2">{q.text}</p>
                  {q.hint && (
                    <p className="text-sm text-gray-500 mb-2">
                      # Hint: {q.hint}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <input
                      type="text"
                      className="flex-1 bg-[#1E1E1E] border border-[#3D3D3D] rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-400"
                      placeholder="Enter your answer..."
                      onChange={(e) =>
                        onAnswerSubmit(taskId, q.id, e.target.value)
                      }
                      value={answers[`${taskId}-${q.id}`] || ""}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalDesign;
