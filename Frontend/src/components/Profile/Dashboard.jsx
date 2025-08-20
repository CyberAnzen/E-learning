import React from 'react';
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="px-0 min-h-screen font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#00ffff]/60 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <Users className="w-8 h-8 text-[#00ffff]/50" />
          </div>
        </div>
        
        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#00ffff]/60 text-sm">Active Projects</p>
              <p className="text-2xl font-bold text-white">42</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500/70" />
          </div>
        </div>
        
        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#00ffff]/60 text-sm">Growth</p>
              <p className="text-2xl font-bold text-white">+12%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500/70" />
          </div>
        </div>
        
        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#00ffff]/60 text-sm">Activity</p>
              <p className="text-2xl font-bold text-white">89%</p>
            </div>
            <Activity className="w-8 h-8 text-yellow-500/70" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
          <h2 className="text-xl font-semibold text-[#00ffff] mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              "User John Doe created a new project",
              "Team Alpha completed milestone 3",
              "Sarah Chen updated her profile",
              "New team member joined Dev Squad"
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#00ffff] rounded-full"></div>
                <p className="text-[#00ffff]/70">{activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6">
          <h2 className="text-xl font-semibold text-[#00ffff] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-[#00ffff]/10 rounded-lg hover:bg-[#00ffff]/20 transition-colors">
              <Users className="w-6 h-6 text-[#00ffff] mx-auto mb-2" />
              <p className="text-sm text-white">Manage Users</p>
            </button>
            <button className="p-4 bg-[#00ffff]/10 rounded-lg hover:bg-[#00ffff]/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-[#00ffff] mx-auto mb-2" />
              <p className="text-sm text-white">View Reports</p>
            </button>
            <button className="p-4 bg-[#00ffff]/10 rounded-lg hover:bg-[#00ffff]/20 transition-colors">
              <Activity className="w-6 h-6 text-[#00ffff] mx-auto mb-2" />
              <p className="text-sm text-white">System Status</p>
            </button>
            <button className="p-4 bg-[#00ffff]/10 rounded-lg hover:bg-[#00ffff]/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-[#00ffff] mx-auto mb-2" />
              <p className="text-sm text-white">Analytics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}