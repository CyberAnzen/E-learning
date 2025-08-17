import React from "react";
import { Plus, UserPlus } from "lucide-react";


export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="flex bg-black/30 p-1 rounded-lg mb-6">
      <button
        onClick={() => setActiveTab("join")}
        className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-all duration-300 ${
          activeTab === "join"
            ? "bg-[#00ffff]/10 text-[#00ffff] shadow-sm"
            : "text-[#00ffff]/60 hover:text-[#00ffff]/80"
        }`}
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Join Team
      </button>
      <button
        onClick={() => setActiveTab("create")}
        className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-all duration-300 ${
          activeTab === "create"
            ? "bg-[#00ffff]/10 text-[#00ffff] shadow-sm"
            : "text-[#00ffff]/60 hover:text-[#00ffff]/80"
        }`}
      >
        <Plus className="w-5 h-5 mr-2" />
        Create Team
      </button>
    </div>
  );
}