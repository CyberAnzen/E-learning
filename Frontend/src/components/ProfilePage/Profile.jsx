import React, { useEffect, useState } from "react";
import {
  Home,
  User,
  FileText,
  Settings,
  Calendar,
  BarChart,
  Plus,
  X,
  Menu,
  AlignLeft,
  CircleChevronRight,
  ChevronRight,
  Copy,
} from "lucide-react";
export default function ProfileSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  const menuItems = [
    { name: "Dashboard", icon: <Home /> },
    { name: "User Profile", icon: <User /> },
    { name: "Documents", icon: <FileText /> },
    { name: "Setting", icon: <Settings /> },
    { name: "Schedule", icon: <Calendar /> },
    { name: "Report", icon: <BarChart /> },
  ];
  const inputStyle =
    "w-full px-4 py-0 rounded-lg inset-0 rounded-full bg-gradient-to-r from-[#00ff00]/15 via-[#32cd32]/10 to-[#00ff00]/5 border border-[#00ff00]/30 transition-all duration-300 text-white border border-[#00ff00]/30 placeholder-[#00ff00]/30 outline-none focus:outline-none focus:ring-1 focus:ring-[#00ff00]";

  return (
    <>
      <div className="min-h-screen bg-[rgb(23,24,26)] text-white flex">
        {/* Sidebar */}
        <div
          className={`fixed z-30 inset-y-0 left-0 w-64 lg:w-70 bg-black/50 shadow transform transition-transform duration-300 ease-in-out md:translate-x-0 lg:m-2 border border-[#00ff00]/30 rounded-2xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:z-0 md:block`}
        >
          <div className="p-4 border-b border-[#00ff00]/30">
            <div className="flex items-center space-x-2">
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-semibold text-[#00ff00]">
                  Cameron Williamson
                </h4>
                <p className="text-xs text-gray-400 flex gap-2">
                  ID: 3482465765 <Copy className="cursor-pointer hover:text-[#00ff00]" size={14} />
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
                className="flex items-center px-4 py-2 hover:text-[#00ff00] cursor-pointer"
              >
                <div className="mr-3 ">{item.icon}</div>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
            <div className="mt-30 px-4 ">
              <button className="w-full flex items-center justify-center border border-dashed border-gray-500 py-2 rounded text-gray-300">
                <Plus className="w-4 h-4 mr-2" />
                Add New Project
              </button>
            </div>
          </nav>
          <div className="mt-6 px-4 space-y-2 text-sm text-gray-400">
            <div>
              Web Design <span className="float-right">25%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded">
              <div className="h-2 bg-green-500 rounded w-1/4" />
            </div>
            <div>
              Design System <span className="float-right">50%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded">
              <div className="h-2 bg-yellow-500 rounded w-1/2" />
            </div>
            <div>
              Webflow Dev <span className="float-right">75%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded">
              <div className="h-2 bg-blue-500 rounded w-3/4" />
            </div>
          </div>
        </div>

        {/* Click-outside overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-1.00 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Navbar */}
        <div className="md:hidden absolute top-1 left-0 z-20 bg-black/50 rounded-2xl p-2 h-12 w-10 shadow mt-20">
          <button onClick={() => setSidebarOpen(true)}>
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        <main className="flex-1 overflow-x-hidden px-1 md:px-3 py-3 md:mt-0">
          <div className=" px-0	 min-h-screen font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side (Main Info) */}
              <div className="lg:col-span-2 space-y-6">
                {/* General Information */}
                <div className="bg-black/50	 rounded-xl border border-[#00ff00]/30 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg text-[#00ff00] font-semibold">General Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      defaultValue="Cameron"
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      defaultValue="Williamson"
                      className={inputStyle}
                    />
                    <select className={inputStyle}>
                      <option selected className="bg-black/50">Spain</option>
                      <option className="bg-black/50">India</option>
                    </select>
                    <input
                      type="text"
                      placeholder="City"
                      defaultValue="Plaza del Rey No. 1"
                      className={inputStyle}
                    />
                    <select className={inputStyle}>
                      <option selected className="bg-black/50">Remote</option>
                      <option className="bg-black/50">Onsite</option>
                    </select>
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      defaultValue="28004"
                      className={inputStyle}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      defaultValue="cameron_williamson@gmail.com"
                      className={inputStyle}
                      disabled
                    />
                    <input
                      type="text"
                      placeholder="Team"
                      defaultValue="Product & IT"
                      className={inputStyle}
                    />
                  </div>
                  <div className="text-right">
                    <button className="btn btn-neutral hover:text-[#00ff00]">Save all</button>
                  </div>
                </div>

                {/* Password Info */}
                <div className="bg-black/50	 rounded-xl border border-[#00ff00]/30 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg text-[#00ff00] font-semibold">
                    Password Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className={inputStyle}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className={inputStyle}
                    />
                  </div>
                  <ul className="text-sm text-[#00ff00]/30 list-disc pl-5">
                    <li>At least 8 characters and up to 12 characters</li>
                    <li>At least one lowercase character</li>
                    <li>
                      Password must include at least one uppercase character
                    </li>
                  </ul>
                  <div className="text-right">
                    <button className="btn btn-neutral hover:text-[#00ff00]">Save all</button>
                  </div>
                </div>
              </div>

              {/* Right Side (Profile + Settings) */}
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-black/50	 rounded-xl border border-[#00ff00]/30 p-6 flex items-center space-x-4 shadow-sm">
                  <div className="avatar">
                    <div className="w-16 rounded-full">
                      <img
                        src="https://avatars.githubusercontent.com/u/1?v=4"
                        alt="avatar"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#00ff00]">Cameron Williamson</h3>
                    <p className="text-sm text-gray-500">Lead Product Design</p>
                    <button className="text-sm text-blue-500 mt-1 hover:text-[#00ff00]">
                      Change Avatar
                    </button>
                  </div>
                </div>

                {/* Language / Timezone */}
                <div className="bg-black/50	 rounded-xl border border-[#00ff00]/30 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#00ff00]">Language | Timezone</h2>
                  <select className={inputStyle}>
                    <option selected>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                  </select>
                  <select className={inputStyle}>
                    <option>GMT+07:00</option>
                    <option selected>GMT+05:30</option>
                    <option>GMT+00:00</option>
                  </select>
                  <div className="flex justify-between">
                    <button className="btn btn-ghost">Cancel</button>
                    <button className="btn btn-neutral hover:text-[#00ff00]">Save</button>
                  </div>
                </div>

                {/* Team Accounts */}
                <div className="bg-black/50	 rounded-xl border border-[#00ff00]/30 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#00ff00]">Team Account</h2>
                  <div className="flex justify-between items-center border border-[#00ff00]/30 rounded-lg px-4 py-2">
                    <div>
                      <p className="font-medium text-white ">
                        Slack account
                      </p>
                      <a
                        className="text-sm text-[#00ff00]/30"
                        href="https://www.slack.com"
                      >
                        www.slack.com
                      </a>
                    </div>
                    <button className="btn btn-outline btn-sm hover:text-[#00ff00]">Remove</button>
                  </div>
                  <div className="flex justify-between items-center border border-[#00ff00]/30 rounded-lg px-4 py-2">
                    <div>
                      <p className="font-medium text-white">
                        Trello account
                      </p>
                      <a
                        className="text-sm text-[#00ff00]/30"
                        href="https://www.trello.com"
                      >
                        www.trello.com
                      </a>
                    </div>
                    <button className="btn btn-outline btn-sm hover:text-[#00ff00]">Remove</button>
                  </div>
                  <div className="flex justify-between">
                    <button className="btn btn-ghost">Cancel</button>
                    <button className="btn btn-neutral hover:text-[#00ff00]">Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
