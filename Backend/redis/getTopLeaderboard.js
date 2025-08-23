const { redis } = require("./config/connectRedis");

const LEADERBOARD_KEY = process.env.LEADERBOARD_KEY; // sorted set
const TEAM_META_KEY = process.env.TEAM_META_KEY;     // hash for extra data


/**
 * Get top N leaderboard entries with metadata
 * @param {number} limit
 */
async function getTopLeaderboard(limit = 10) {
  const raw = await redis.zRangeWithScores(LEADERBOARD_KEY, -limit, -1); // highest first
  const result = [];

  for (const entry of raw.reverse()) { // reverse to show highest first
    const meta = await redis.hGetAll(`${TEAM_META_KEY}:${entry.value}`);
    result.push({
      teamName: meta.teamName,
      score: Number(meta.score),
      updatedAt: new Date(Number(meta.updatedAt)),
    });
  }

  return result;
}
module.exports = { getTopLeaderboard };