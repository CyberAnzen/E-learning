// src/components/Sidebar.jsx
import React, { useState } from "react";
import {
  Home,
  User,
  FileText,
  Settings,
  Calendar,
  BarChart,
  Plus,
  X,
  ChevronRight,
  Copy,
  Users,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeItem,
  setActiveItem,
}) {
  const { user } = useAppContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.regNumber || "748589549");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home /> },
    { name: "User Profile", icon: <User /> },
    { name: "Team", icon: <Users /> },
    { name: "Documents", icon: <FileText /> },
    { name: "Setting", icon: <Settings /> },
    { name: "Schedule", icon: <Calendar /> },
    { name: "Report", icon: <BarChart /> },
  ];

  return (
    <>
      <div
        className={`fixed z-30  left-1 bottom-3 w-64 lg:w-72 h-[84vh] bg-black/50 shadow transform transition-transform duration-300 ease-in-out border border-[#00ffff]/25 rounded-2xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block`}
      >
        <div className="p-4 border-b border-[#00ffff]/30">
          <div className="flex items-center space-x-2">
            <img
              src="https://i.pinimg.com/736x/af/70/bb/af70bb880077591b711b83ee7717c91b.jpg"
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col gap-0.5">
              <h4 className="text-sm font-semibold text-[#00ffff]">
                {user?.userDetails?.name || "Cameron Williamson"}
              </h4>
              <p className="text-xs text-gray-400 flex gap-2 relative">
                ID: {user?.regNumber || "748589549"}
                <Copy
                  onClick={handleCopy}
                  className="cursor-pointer hover:text-[#00ffff]/25"
                  size={14}
                />
                {copied && (
                  <span className="absolute -top-8 left-0 text-xs text-black font-medium bg-[#00ff00] px-2 py-0.5 rounded shadow">
                    Copied!
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            className="md:hidden absolute top-4 right-4 text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="mt-4 px-2 space-y-2 text-gray-300">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`flex items-center px-4 py-2 cursor-pointer transition-colors ${
                activeItem === item.name
                  ? "text-[#00ffff] bg-[#00ffff]/10"
                  : "hover:text-[#00ffff] hover:bg-[#00ffff]/5"
              }`}
            >
              <div className="mr-3">{item.icon}</div>
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Click-outside overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Navbar */}
      <div className="md:hidden absolute top-1 left-0 z-20 bg-black/50 rounded-2xl p-2 h-12 w-10 shadow mt-20">
        <button onClick={() => setSidebarOpen(true)}>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </>
  );
}