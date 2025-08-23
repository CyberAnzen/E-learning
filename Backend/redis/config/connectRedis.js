const { createClient } = require("redis");

const REDIS_URI = process.env.REDIS_URI || "redis://localhost:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "REDIS_PASSWORD";

const redis = createClient({
  url: REDIS_URI,
  password: REDIS_PASSWORD,
});

redis.on("error", (e) => console.error("[Redis Error]", e));

/**
 * Connect to Redis with up to 5 retries
 */
const connectRedis = async (retries = 5, delay = 2000) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await redis.connect();
      console.log("[connectRedis] 🛢️ Redis connection established");
      return; // success
    } catch (error) {
      attempt++;
      console.error(
        `[connectRedis] ❌ Failed attempt ${attempt}/${retries}:`,
        error.message
      );

      if (attempt < retries) {
        console.log(`[connectRedis] ⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error(
          "[connectRedis] ❌ Max retries reached. Could not connect to Redis."
        );
        throw error; // bubble up after 5 failures
      }
    }
  }
};

module.exports = { connectRedis, redis };
