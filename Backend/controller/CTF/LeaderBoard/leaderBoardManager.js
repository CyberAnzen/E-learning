// websocketManager.js
const WebSocketLeaderboardServer = require("./websocketServer");
const LeaderboardService = require("./leaderboardService");


class LeaderboardManager {
  constructor() {
    if (!LeaderboardManager.instance) {
      this.webSocketServer = new WebSocketLeaderboardServer();
      this.leaderboardService = new LeaderboardService(this.webSocketServer);

      // ❌ don’t re-bind teamRegistered here

      LeaderboardManager.instance = this;
      this.leaderboardService.setupEventHandlers();
    }

    return LeaderboardManager.instance;
  }

  attachToServer(server) {
    this.webSocketServer.attachToServer(server, "/ws/leaderboard");
  }

  updateTeamScore(teamName, points, action = "increase") {
    return this.leaderboardService.updateTeamScore(teamName, points, action);
  }

  broadcastLeaderboard() {
    return this.leaderboardService.broadcastLeaderboard();
  }

  getConnectionStats() {
    return this.leaderboardService.getConnectionStats();
  }

  getConnectedClientCount() {
    return this.leaderboardService.getConnectedClientCount();
  }

  broadcastAllRanks() {
    return this.leaderboardService.broadcastAllRanks();
  }
}

const instance = new LeaderboardManager();
Object.freeze(instance);

module.exports = instance;
