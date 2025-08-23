const { redis } = require("./config/connectRedis");

const LEADERBOARD_KEY = process.env.LEADERBOARD_KEY; // sorted set
const TEAM_META_KEY = process.env.TEAM_META_KEY;     // hash for extra data


/**
 * Get a paginated slice of the leaderboard
 * @param {number} page - page number (1-based)
 * @param {number} pageSize - number of teams per page
 * @returns {Array<{teamName, score, updatedAt, rank}>}
 */
async function getLeaderboardPage(page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const raw = await redis.zRangeWithScores(LEADERBOARD_KEY, start, end, { REV: true });
  const result = [];

  let rank = start + 1;
  for (const entry of raw) {
    const meta = await redis.hGetAll(`${TEAM_META_KEY}:${entry.value}`);
    result.push({
      teamName: meta.teamName,
      score: Number(meta.score),
      updatedAt: new Date(Number(meta.updatedAt)),
      rank: rank++
    });
  }

  return result;
}
module.exports = { getLeaderboardPage };