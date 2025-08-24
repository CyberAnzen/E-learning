const { redis } = require("./config/connectRedis");
const LEADERBOARD_KEY = process.env.LEADERBOARD_KEY; // sorted set
const TEAM_META_KEY = process.env.TEAM_META_KEY;     // hash for extra data

async function clearLeaderboard() {

  // Get all team names from leaderboard
  const teamNames = await redis.zRange(LEADERBOARD_KEY, 0, -1);

  // Build all hash keys to delete
  const metaKeys = teamNames.map((team) => `${TEAM_META_KEY}:${team}`);

  // Delete leaderboard sorted set + all team hashes
  await redis.del(LEADERBOARD_KEY, ...metaKeys);

  console.log("✅ Leaderboard cleared");
}

module.exports = { clearLeaderboard };
