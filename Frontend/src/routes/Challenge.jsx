import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import ChallengeCardSkeleton from "../components/Challenges/ChallengeCardSkeleton";
import AddChallengesCard from "../components/Challenges/Admin/AddChallengesCard";
import ModifyChallengesCard from "../components/Challenges/Admin/ModifyChallengesCard";
import Usefetch from "../hooks/Usefetch";
import { useAppContext } from "../context/AppContext";
import ChallengeCard from "../components/Challenges/ChallengeCard";
export default function Challenge() {
  const { Admin, loggedIn } = useAppContext();
  const [scaleFactor, setScaleFactor] = useState(0.36);

  const {
    Data: ChallengesData,
    error: fetchError,
    loading,
    retry: fetchRetry,
  } = Usefetch(`challenge/`, "get", null, {}, true);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const leaderboard = [
    { rank: 1, name: "Alex Smith", score: 1250 },
    { rank: 2, name: "Jamie Lee", score: 1100 },
    { rank: 3, name: "Chris Wong", score: 950 },
    { rank: 4, name: "Sam Patel", score: 800 },
  ];

  const handleChallengeClick = (id) => {
    console.log(`Clicked on course with id: ${id}`);
  };

  const redColors = {
    easy: "url(#greenGlass)",
    intermediate: "url(#goldGlass)",
    hard: "url(#orangeGlass)",
    advanced: "url(#rubyGlass)",
  };

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 640) setScaleFactor(0.35); // mobile
      else if (width < 1024) setScaleFactor(0.28); // tablet
      else if (width < 1440) setScaleFactor(0.32); // laptop
      else setScaleFactor(0.36); // large screens
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <section className="min-h-screen  text-white">
      {/* put SVG defs in the DOM so child SVGs can use url(#id) */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
        aria-hidden
      >
        <defs>
          <linearGradient id="rubyGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(200,0,40,0.8)" />{" "}
            {/* Deep ruby red */}
            <stop offset="100%" stopColor="rgba(255,150,170,0.5)" />{" "}
            {/* Light pink highlight */}
          </linearGradient>

          <linearGradient id="greenGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,150,40,0.8)" />{" "}
            {/* Deep emerald green */}
            <stop offset="100%" stopColor="rgba(170,255,200,0.5)" />{" "}
            {/* Soft mint highlight */}
          </linearGradient>

          <linearGradient id="goldGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(200,150,0,0.85)" />{" "}
            {/* Rich golden yellow */}
            <stop offset="100%" stopColor="rgba(255,255,180,0.55)" />
            {/* Warm pale yellow highlight */}
          </linearGradient>

          <linearGradient id="orangeGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(220,90,0,0.85)" />{" "}
            {/* Deep burnt orange */}
            <stop offset="100%" stopColor="rgba(255,200,150,0.55)" />
            {/* Warm peach highlight */}
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        className="flex flex-col md:flex-row"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* <motion.aside
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
        </motion.aside> */}

        <motion.main className="flex-1 p-6" variants={itemVariants}>
          <h1 className="text-3xl font-bold ml-6">Challenges</h1>
          <section
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 pr-15 gap-4 min-w-screen  max-w-screen ${
              loading ? "mt-10" : "mt-20"
            }`}
          >
            {loading ? (
              Array.from({ length: 40 }).map((_, index) => (
                <ChallengeCardSkeleton key={index} scaleFactor={0.3} />
              ))
            ) : Admin ? (
              <>
                <AddChallengesCard />
                {ChallengesData?.challenges?.map((challenge) => (
                  <ModifyChallengesCard
                    key={challenge._id}
                    challenge={challenge}
                    onCourseClick={handleChallengeClick}
                  />
                ))}
              </>
            ) : (
              <>
                {ChallengesData?.challenges?.map((Challenge, index) => (
                  <div
                    key={index}
                    className={`relative w-full h-full flex justify-center items-center 
        transition-all duration-700 ease-out transform
        hover:z-10 hover:scale-105
        opacity-0 translate-y-5 animate-cardAppear -mt-14`}
                    style={{
                      animationDelay: `${index * 80}ms`,
                    }}
                  >
                    <ChallengeCard
                      Challenge={Challenge}
                      scaleFactor={scaleFactor}
                      redColor={redColors?.[Challenge?.difficulty]}
                    />
                  </div>
                ))}
              </>
            )}
          </section>
        </motion.main>
      </motion.div>
    </section>
  );
}
