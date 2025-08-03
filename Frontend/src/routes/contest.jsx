import React, { useEffect } from "react";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import ChallengeSkeleton from "../components/Challenges/ChallengeSkeleton";
import AddChallengesCard from "../components/Challenges/Admin/AddChallengesCard";
import MdodifyChallengesCard from "../components/Challenges/Admin/ModifyChallengesCard";
export default function ContestPage() {
  const loading = false;
  const isAdmin = true;

  const fakeCourse = {
    id: "1",
    title: "Introduction to Cybersecurity",
    description:
      "Learn the basics of protecting systems and networks from cyber threats.",
    icon: "Cybersecurity",
    progress: 60,
    completedLessons: 3,
    totalLessons: 5,
    category: "Security",
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Sample leaderboard data
  const leaderboard = [
    { rank: 1, name: "Alex Smith", score: 1250 },
    { rank: 2, name: "Jamie Lee", score: 1100 },
    { rank: 3, name: "Chris Wong", score: 950 },
    { rank: 4, name: "Sam Patel", score: 800 },
  ];
  const handleChallengeClick = (id) => {
    console.log(`Clicked on course with id: ${id}`);
  };
  return (
    <section className="min-h-screen text-white">
      <motion.div
        className="flex flex-col md:flex-row"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Leaderboard (Top on mobile, Right on larger screens) */}
        <motion.aside
          className="w-full md:w-1/4 bg-gray-800 p-6 flex-shrink-0 md:h-screen order-first md:order-last"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" /> Leaderboard
          </h2>
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg min-w-[200px] md:min-w-0"
              >
                <span className="text-lg font-bold text-yellow-400 w-8">
                  #{entry.rank}
                </span>
                <div className="flex-1">
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-sm text-gray-300">{entry.score} points</p>
                </div>
              </div>
            ))}
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main className="flex-1 p-6" variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-10">Challenges</h1>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <ChallengeSkeleton key={index} />
              ))
            ) : isAdmin ? (
              <>
                <AddChallengesCard />
                <MdodifyChallengesCard
                  course={fakeCourse}
                  onCourseClick={handleChallengeClick}
                />
              </>
            ) : (
              <h2>something</h2>
            )}
          </section>
        </motion.main>
      </motion.div>
      
    </section>
  );
}
