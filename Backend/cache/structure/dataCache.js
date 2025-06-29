//the structure of the cache is a simple object with data and lastUpdated properties
// eg:
// {//   data: { ... },
//   lastUpdated: Date.now()
// }
const customError = require("../../utilies/customError");

class dataCache {
  constructor(name,fetchFunction) {
    this.name = name;
    this.data = null;
    this.lastUpdated = null;
    this.fetchFunction = fetchFunction;
  }

  async refresh() {
    try {
      const newData = await this.fetchFunction();
      if (!newData.success|| !newData.data) {
        throw new customError("Invalid data fetched", 500,{}, newData.error || "No data returned from fetch function");
      }
      this.update(newData.data);

      console.log(`[CacheManager => dataCache] ${this.name} Cache refreshed at ${new Date().toISOString()}`);
      return {
      success: true,
      data: newData.data,
    };
    } catch (err) {
      console.error("Cache refresh error:",  err.error || err.message || "Unknown error");
      if (err instanceof customError) {
        return {
          success: false,
          statusCode: err.statusCode || 500,
          message: err.message || "Failed to refresh cache",
          error: err.error || "Unknown error"
        };
      }
      return {
        success: false,
        statusCode: 500,
        message: "Failed to refresh cache",
        error: err.message || "Unknown error"
      };
    }
  }

  update(data) {
    this.data = data;
    this.lastUpdated = new Date();
  }

  get() {
    return {
      data: this.data,
      lastUpdated: this.lastUpdated,
      isStale: () =>
        this.lastUpdated
          ? (Date.now() - this.lastUpdated.getTime()) >  12* 60* 60 * 1000
          : true,
    };
  }
}

module.exports = dataCache;
