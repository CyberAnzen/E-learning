import React, { useState, useEffect } from "react";
import { Activity, Film, Shield } from "lucide-react";

export default function Settings() {
  const [animationOff, setAnimationOff] = useState(
    localStorage.getItem("animationOff") === "true"
  );
  //   const [privacy, setPrivacy] = useState(
  //     localStorage.getItem("privacy") === "true"
  //   );

  // save changes
  useEffect(() => {
    localStorage.setItem("animationOff", animationOff);
    // localStorage.setItem("privacy", privacy);
  }, [animationOff]);

  return (
    <div className="px-0 min-h-screen font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Display Settings */}
        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
          <h2 className="text-xl font-semibold text-[#00ffff] mb-4">
            Display Settings
          </h2>
          <div className="space-y-4">
            {/* Animations */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Film className="w-6 h-6 text-[#00ffff]" />
                <p className="text-white">Animations</p>
              </div>
              <button
                onClick={() => setAnimationOff(!animationOff)}
                className={`w-12 h-6 rounded-full flex items-center transition ${
                  animationOff ? "bg-red-500/70" : "bg-green-500/70"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transform transition ${
                    animationOff ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
          {/* <h2 className="text-xl font-semibold text-[#00ffff] mb-4">
            Security & Privacy
          </h2> */}
          <div className="space-y-4">
            {/* Privacy */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-[#00ffff]" />
                <p className="text-white">Enhanced Privacy</p>
              </div>
              <button
                onClick={() => setPrivacy(!privacy)}
                className={`w-12 h-6 rounded-full flex items-center transition ${
                  privacy ? "bg-green-500/70" : "bg-gray-500/70"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transform transition ${
                    privacy ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div> */}

            {/* System Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-[#00ffff]" />
                <p className="text-white">System Status</p>
              </div>
              <p className="text-sm text-green-400">All Good ✅</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
