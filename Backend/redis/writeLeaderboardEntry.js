const { redis } = require("./config/connectRedis");
const LeaderboardManager=require("../controller/CTF/LeaderBoard/leaderBoardManager")


const LEADERBOARD_KEY = process.env.LEADERBOARD_KEY; // sorted set
const TEAM_META_KEY = process.env.TEAM_META_KEY;     // hash for extra data

/**
 * Write or update a leaderboard entry in Redis
 * @param {string} teamName - Name of the team
 * @param {number} score - Score to set
 * @param {Date} updatedAt - Last updated time
 */
async function writeLeaderboardEntry(teamName,teamId, score, isTeam=true,updatedAt = new Date()) {
  try {
  const member = String(teamId);

  const ts = updatedAt.getTime(); // ms timestamp
  const compositeScore = (score * 1e13) + (1e13 - ts);

  const pipeline = redis.multi();

  // 1. Sorted set → store composite score
  pipeline.zAdd(LEADERBOARD_KEY, {
    score: compositeScore,
    value: member,
  });

  // 2. Hash → store metadata
  pipeline.hSet(`${TEAM_META_KEY}:${member}`, {
    teamName: String(teamName),
    isTeam: isTeam? "true":"solo",
    teamId: member,
    score: score,
    updatedAt: ts,
  });

  await pipeline.exec();

  console.log(`✅ Leaderboard updated: ${teamName} -> ${score} (at ${updatedAt})`);
  // Notify connected clients about the update
  await LeaderboardManager.broadcastAllRanks().catch((err) => {
    console.error("❌ Failed to broadcast leaderboard after update:", err);
    throw err;
  });
     return {success:true};
  } catch (error) {
    return { success: false, message: error.message}
  }
}

module.exports = { writeLeaderboardEntry };