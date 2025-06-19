import React from "react";
import { Medal } from "lucide-react";

const SidebarItem = ({ item, currentChapter, onChapterSelect }) => {
  return (
    <div
      onClick={() => onChapterSelect(item)}
      className={`mx-2 mb-2 p-4 rounded-lg transition-all cursor-pointer backdrop-blur-sm
        ${
          currentChapter.id === item.id
            ? "bg-gradient-to-r from-blue-500/20 to-cyan-400/10 shadow-[0_0_15px_rgba(59,130,246,0.3)] border-l-4 border-cyan-400 scale-[1.02]"
            : "hover:bg-white/5 hover:shadow-[0_0_10px_rgba(59,130,246,0.15)]"
        }
        group relative overflow-hidden`}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 ${
        currentChapter.id === item.id 
          ? "bg-gradient-to-r from-blue-500/20 via-cyan-400/5 to-transparent"
          : "bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
      } transition-opacity duration-300`} />
      
      {/* Cyber accent line */}
      <div className={`absolute h-full w-1 left-0 top-0 ${
        currentChapter.id === item.id 
          ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]" 
          : "bg-gray-700"
      }`} />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-md ${
            currentChapter.id === item.id 
              ? "bg-blue-500/30 text-cyan-300 shadow-[0_0_5px_rgba(34,211,238,0.5)]" 
              : "text-blue-400 group-hover:text-cyan-300"
          } transition-colors duration-300`}>
            <item.icon className="w-5 h-5" />
          </div>
          <p className={`font-medium ${
            currentChapter.id === item.id 
              ? "text-white" 
              : "text-gray-300 group-hover:text-white"
          } transition-colors duration-300`}>
            {item.chapter}
          </p>
        </div>
        {item.completed && (
          <Medal className="w-5 h-5 text-yellow-400 filter drop-shadow-[0_0_3px_rgba(250,204,21,0.7)]" />
        )}
      </div>
    </div>
  );
};

export default React.memo(SidebarItem);