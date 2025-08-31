// utils/ChallengeCache.js
const cache = new Map();
const TTL = 2 * 60 * 1000; // 2 minutes

export function getCachedChallenge(id) {
  const entry = cache.get(id);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL) {
    cache.delete(id);
    return null;
  }
  return entry.data;
}

export function setCachedChallenge(id, data) {
  cache.set(id, { data, ts: Date.now() });
}

// Background sweep every minute
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of cache.entries()) {
    if (now - entry.ts > TTL) {
      cache.delete(id);
    }
  }
}, 60 * 1000);
