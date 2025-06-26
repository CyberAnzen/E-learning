// cache/CacheManager.js
class cacheManager {
  constructor() {
    this.caches = new Map();
    this.intervals = new Map(); // To track refresh intervals
  }

  /**
   * Register any cache with custom class
   * @param {string} name - Unique name
   * @param {CacheClass} CacheClass - Cache class (EventCache, UserCache, etc.)
   * @param {function} fetchFunction - Async fetch function
   * @param {number} intervalMs - Refresh interval
   * @returns {object} Operation status
   */
  async registerCache(name, CacheClass, fetchFunction, intervalMs) {
    try {
      const refreshInterval = intervalMs ?? (Number(process.env.CACHE_REFRESH_INTERVAL) || 12 * 60 * 60 * 1000);
      if (this.caches.has(name)) {
        return {
          success: false,
          statusCode: 409, // Conflict
          message: `Cache "${name}" already registered.`
        };
      }

      const cache = new CacheClass(fetchFunction);
      this.caches.set(name, cache);

      // Initial refresh
      const refreshResult = await cache.refresh();
      if (!refreshResult.success) {
        this.caches.delete(name);
        return refreshResult;
      }

      // Set up periodic refresh
      const interval = setInterval(async () => {
        await cache.refresh();
      }, refreshInterval);
      this.intervals.set(name, interval);

      return {
        success: true,
        statusCode: 201, // Created
        message: `Cache "${name}" registered and refreshed successfully.`,
        data: refreshResult.data
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500, // Internal Server Error
        message: `Failed to register cache "${name}"`,
        error: error.message
      };
    }
  }

  getCache(name) {
    const cache = this.caches.get(name);
    if (!cache) {
      throw {
        success: false,
        statusCode: 404, // Not Found
        message: `Cache "${name}" not found.`
      };
    }
    return cache;
  }

  /**
   * Refresh a cache manually
   * @param {string} name - Cache name
   * @returns {object} Operation status
   */
  async refreshCache(name) {
    try {
      const cache = this.getCache(name);
      const result = await cache.refresh();
      
      return {
        success: true,
        statusCode: 200, // OK
        message: `Cache "${name}" refreshed successfully.`,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        statusCode: error.statusCode || 500,
        message: error.message || `Failed to refresh cache "${name}"`,
        error: error.error || error.message
      };
    }
  }

  listCacheNames() {
    return {
      success: true,
      statusCode: 200,
      data: [...this.caches.keys()]
    };
  }

  /**
   * Unregister and clean up a cache
   * @param {string} name - Cache name
   * @returns {object} Operation status
   */
  unregisterCache(name) {
    try {
      const interval = this.intervals.get(name);
      if (interval) {
        clearInterval(interval);
        this.intervals.delete(name);
      }

      if (!this.caches.delete(name)) {
        return {
          success: false,
          statusCode: 404,
          message: `Cache "${name}" not found.`
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: `Cache "${name}" unregistered successfully.`
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: `Failed to unregister cache "${name}"`,
        error: error.message
      };
    }
  }
}

module.exports = new cacheManager();