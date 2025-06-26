const cacheManager =require('./cacheManager');
const dataCache = require('./structure/dataCache');

const fetchLatestEvents = require('./fetchers/fetchLatestEvent');

function initializeCaches() {
  try {
    cacheManager.registerCache('eventCache', dataCache, fetchLatestEvents);

    console.log('[CacheManager] All caches initialized');
  } catch (err) {
    console.error('Failed to initialize caches:', err);
  }
}

module.exports = initializeCaches;