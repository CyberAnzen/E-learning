const {redis} = require("./config/connectRedis");

const LEADERBOARD_KEY = process.env.LEADERBOARD_KEY; // sorted set
const TEAM_META_KEY = process.env.TEAM_META_KEY;     // hash for extra data


/**
 * List all teams with rank, score, and updatedAt
 * @returns {Array<{teamName, score, updatedAt, rank}>}
 */
async function listAllTeamRanks() {
  const raw = await redis.zRangeWithScores(LEADERBOARD_KEY, 0, -1, { REV: true });
  const result = [];

  let rank = 1;
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
module.exports = { listAllTeamRanks };