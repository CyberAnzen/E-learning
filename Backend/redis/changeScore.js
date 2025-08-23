const { redis } = require("./config/connectRedis");

const LEADERBOARD_KEY = process.env.LEADERBOARD_KEY; // sorted set
const TEAM_META_KEY = process.env.TEAM_META_KEY;     // hash for extra data


/**
 * Increase a team's score (and update updatedAt)
 * @param {string} teamName
 * @param {number} delta
 */
async function increaseTeamScore(teamName, delta) {
  const metaKey = `${TEAM_META_KEY}:${teamName}`;
  const meta = await redis.hGetAll(metaKey);

  let newScore = (Number(meta.score) || 0) + delta;
  let updatedAt = Date.now();

  // recompute composite score
  const compositeScore = (newScore * 1e13) + (1e13 - updatedAt);

  const pipeline = redis.multi();
  pipeline.zAdd(LEADERBOARD_KEY, { score: compositeScore, value: teamName });
  pipeline.hSet(metaKey, { teamName, score: newScore, updatedAt });
  await pipeline.exec();

  return { teamName, score: newScore, updatedAt: new Date(updatedAt) };
}

/**
 * Decrease a team's score (and update updatedAt)
 * @param {string} teamName
 * @param {number} delta
 */
async function decreaseTeamScore(teamName, delta) {
  return increaseTeamScore(teamName, -delta);
}
module.exports = { increaseTeamScore, decreaseTeamScore };