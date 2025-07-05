const cacheManager =require('./cacheManager');
const dataCache = require('./structure/dataCache');
const customError = require('../utilies/customError');
// Import fetch functions
const fetchClassification = require('./fetchers/fetchClassification');
const fetchLatestEvents = require('./fetchers/fetchLatestEvent');


async function initializeCaches() {
  try {
    const caches ={}
    const eventCache = await cacheManager.registerCache('eventCache', dataCache, fetchLatestEvents)
    caches.eventCache = eventCache;
    const classificationCache = await cacheManager.registerCache('classificationCache', dataCache, fetchClassification);
    caches.classificationCache = classificationCache;
    const cached = await listName(caches);
    if (!cached.success) {
     // console.log(cached);
    
      throw new customError(cached.message, cached.statusCode || 500, {uncached:cached.unCached,cached:cached.cached}, cached.error|| 'Unknown error');
    }
    console.log('[CacheManager] All caches initialized');
  } catch (err) {

   console.log('[CacheManager] Initialized caches:',err.data.cached);
    
    console.error('[CacheManager] Failed to initialize caches:', err.message || 'Unknown error');
  }
}
async function listName(name) {
  const unCached = [];
  if (!name) { 
    return {
      success: false,
      message: 'No cache names provided'
    };
  }
  for (let cache in name) {

    if(!name[cache].success){
      unCached.push(cache);
    }
    }
  
  if(unCached.length > 0) {
    const cached = Object.keys(name).filter(c => !unCached.includes(c));

        return {
      success: false, // Not Found
      message: `${unCached.join(', ')}`,
      cached:`${cached.join(', ')}`,
      unCached
    }; 
  }
  else if (unCached.length === 0) {
    return {
      success: true,
      message: 'All caches initialized successfully',
      data: name
    };
  }
}


module.exports = initializeCaches;