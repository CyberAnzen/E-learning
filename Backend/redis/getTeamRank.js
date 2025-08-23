const { redis } = require("./config/connectRedis");

const LEADERBOARD_KEY = process.env.LEADERBOARD_KEY; // sorted set
const TEAM_META_KEY = process.env.TEAM_META_KEY;     // hash for extra data


/**
 * Get the rank of a specific team
 * @param {string} teamName
 * @returns {object} { teamName, rank, score, updatedAt }
 */
async function getTeamRank(teamName) {
  const rank = await redis.zRevRank(LEADERBOARD_KEY, teamName); // 0-based rank
  if (rank === null) return null; // team not found

  const meta = await redis.hGetAll(`${TEAM_META_KEY}:${teamName}`);
  return {
    teamName: meta.teamName,
    score: Number(meta.score),
    updatedAt: new Date(Number(meta.updatedAt)),
    rank: rank + 1 // convert to 1-based
  };
}

module.exports = { getTeamRank };