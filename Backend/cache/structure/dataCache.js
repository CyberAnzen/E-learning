//the structure of the cache is a simple object with data and lastUpdated properties
// eg:
// {//   data: { ... },
//   lastUpdated: Date.now()
// }
class dataCache {
  constructor(fetchFunction) {
    this.data = null;
    this.lastUpdated = null;
    this.fetchFunction = fetchFunction;
  }

  async refresh() {
    try {
      const newData = await this.fetchFunction();
      this.update(newData);

      console.log(`Cache refreshed at ${new Date().toISOString()}`);
      return {
      success: true,
      data: newData
    };
    } catch (err) {
      console.error("Cache refresh error:", err);
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
