class idCache {
  constructor(fetchFunction) {
    this.data = new Map();
    this.fetchFunction = fetchFunction;
  }

  async refresh() {
    try {
      const users = await this.fetchFunction();
      this.data.clear();
      users.forEach(user => this.data.set(user._id.toString(), user));
      console.log('[UserCache] Refreshed');
    } catch (e) {
      console.error('UserCache error:', e);
    }
  }

  get(userId) {
    return this.data.get(userId);
  }

  getAll() {
    return [...this.data.values()];
  }
}

module.exports = idCache;
