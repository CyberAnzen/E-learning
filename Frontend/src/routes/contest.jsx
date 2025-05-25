import React, { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContestPage() {
  // Scroll to top and disable page scrolling on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-gray-900">
      {/* Main Content (Blurred & Inaccessible) */}
      <div className="container mx-auto px-6 py-12 pointer-events-none filter blur-sm">
        <h1 className="text-4xl font-bold text-white mb-6">
          Cybersecurity Contests
        </h1>
        <p className="text-white/70 mb-8">
          Participate in challenges and compete with others
        </p>
        
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#01ffdb]/10 rounded-lg">
              <Trophy className="w-6 h-6 text-[#01ffdb]" />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              Upcoming Contest
            </h2>
          </div>
          <p className="text-white/70 mb-4">
            Join our next cybersecurity challenge starting in 3 days.
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-[#01ffdb] to-[#00c3ff] text-[#0f172a] font-medium rounded-lg hover:opacity-90 transition-opacity">
            Register Now
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-[#01ffdb]/30 transition-colors">
            <h2 className="text-xl font-semibold text-white mb-3">
              Past Contests
            </h2>
            <p className="text-white/70">
              View results and solutions from previous challenges.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-[#01ffdb]/30 transition-colors">
            <h2 className="text-xl font-semibold text-white mb-3">
              Leaderboard
            </h2>
            <p className="text-white/70">
              See the top performers in our cybersecurity contests.
            </p>
          </div>
        </div>
      </div>
      
      {/* Blocking Overlay (Coming Soon...) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Static "Coming Soon..." text */}
        <h1 className="text-5xl font-bold text-white">Coming Soon...</h1>
      </motion.div>
    </div>
  );
}
