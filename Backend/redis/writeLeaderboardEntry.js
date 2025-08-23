const { redis } = require("./config/connectRedis");


const LEADERBOARD_KEY = process.env.LEADERBOARD_KEY; // sorted set
const TEAM_META_KEY = process.env.TEAM_META_KEY;     // hash for extra data

/**
 * Write or update a leaderboard entry in Redis
 * @param {string} teamName - Name of the team
 * @param {number} score - Score to set
 * @param {Date} updatedAt - Last updated time
 */
async function writeLeaderboardEntry(teamName, score, updatedAt = new Date()) {
  const member = String(teamName);

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
    teamName: member,
    score: score,
    updatedAt: ts,
  });

  await pipeline.exec();

  console.log(`✅ Leaderboard updated: ${teamName} -> ${score} (at ${updatedAt})`);
}

module.exports = { writeLeaderboardEntry };