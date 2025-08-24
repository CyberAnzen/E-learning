// leaderboardService.js
const WebSocket = require("ws");

const {
  listAllTeamRanks,
} = require("../../../redis/listAllTeamRanks");


class LeaderboardService {
  constructor(webSocketServer) {
    console.log("LeaderboardService constructor called");
    this.webSocketServer = webSocketServer;
    this.eventHandlersSetUp = false;
    console.log("WebSocket server instance:", this.webSocketServer ? "exists" : "null");
  }

  init(){
    this.broadcastAllRanks();
  }
  setupEventHandlers() {
    if (this.eventHandlersSetUp) {
      console.log("Event handlers already set up");
      return;
    }
    
    console.log("Setting up event handlers for WebSocketLeaderboardServer");
    
    this.webSocketServer.on('clientConnected', async (ws) => {
      try {
        console.log("📢 Client connected event received");
        await this.broadcastAllRanks();  // 🔥 send to all immediately
        console.log("✅ Broadcasted leaderboard after client connect");
      } catch (err) {
        console.error("❌ Error broadcasting on connect:", err);
      }
    });



    // ✅ Check if webSocketServer.on exists
    if (typeof this.webSocketServer.on === 'function') {
      this.webSocketServer.on('teamRegistered', async (ws) => {
        try {
          console.log(`📢 Team registered event received: ${ws.teamName}`);
          await this.sendLeaderboardToClient(ws);
          console.log("✅ Sent leaderboard to newly registered client");

          console.log("✅ Broadcast complete");
        } catch (err) {
          console.error("❌ Error in teamRegistered handler:", err);
        }
      });
      
      this.eventHandlersSetUp = true;
      console.log("✅ Event handlers setup complete");
    } else {
      console.error("❌ webSocketServer.on is not a function");
    }
  }

  // Send leaderboard to a specific client
  async sendLeaderboardToClient(ws) {
    if (!ws.teamName) return;

    try {
      const allRanks = await listAllTeamRanks();
      const top10 = allRanks.slice(0, 10);
      const userRank = allRanks.find((t) => t.teamName === ws.teamName) || null;

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "LEADERBOARD_UPDATE",
            top10,
            userRank,
            timestamp: new Date().toISOString()
          })
        );
      }
    } catch (error) {
      console.error("Error sending leaderboard to client:", error);
    }
  }

  // Broadcast leaderboard to all connected clients
  async broadcastLeaderboard() {
    try {
      const allRanks = await listAllTeamRanks();
      const top10 = allRanks.slice(0, 10);

      this.webSocketServer.getClients().forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.teamName) {
          const userRank = allRanks.find((t) => t.teamName === client.teamName) || null;
          client.send(
            JSON.stringify({
              type: "LEADERBOARD_UPDATE",
              top10,
              userRank,
              timestamp: new Date().toISOString()
            })
          );
        }
      });

      console.log(`Broadcasted leaderboard to ${this.getConnectedClientCount()} clients`);
    } catch (error) {
      console.error("Error broadcasting leaderboard:", error);
    }
  }

    async broadcastAllRanks() {
    try {
      const allRanks = await listAllTeamRanks();
      //const top10 = allRanks.slice(0, 10);

      this.webSocketServer.getClients().forEach((client) => {
        if (client.readyState === WebSocket.OPEN ) {
          //const userRank = allRanks.find((t) => t.teamName === client.teamName) || null;
          client.send(
            JSON.stringify({
              type: "LEADERBOARD_UPDATE",
              allRanks,
              timestamp: new Date().toISOString()
            })
          );
        }
      });

      console.log(`Broadcasted leaderboard to ${this.getConnectedClientCount()} clients`);
    } catch (error) {
      console.error("Error broadcasting leaderboard:", error);
    }
  }

  // Update team score and notify relevant clients
  async updateTeamScore(teamName, points, action = 'increase') {
    try {
      if (action === 'increase') {
        await increaseTeamScore(teamName, points);
      } else {
        await decreaseTeamScore(teamName, points);
      }

      // Notify all clients watching this team
      const teamClients = this.webSocketServer.getClientsByTeam(teamName);
      if (teamClients.length > 0) {
        this.sendLeaderboardToClients(teamClients);
      }

      // Also broadcast to all if it affects top 10
      const allRanks = await listAllTeamRanks();
      const top10Teams = allRanks.slice(0, 10).map(t => t.teamName);
      
      if (top10Teams.includes(teamName)) {
        await this.broadcastLeaderboard();
      }

      return true;
    } catch (error) {
      console.error("Error updating team score:", error);
      return false;
    }
  }

  // Send leaderboard to multiple clients
  async sendLeaderboardToClients(clients) {
    const allRanks = await listAllTeamRanks();
    const top10 = allRanks.slice(0, 10);

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.teamName) {
        const userRank = allRanks.find((t) => t.teamName === client.teamName) || null;
        client.send(
          JSON.stringify({
            type: "LEADERBOARD_UPDATE",
            top10,
            userRank,
            timestamp: new Date().toISOString()
          })
        );
      }
    });
  }

  // Get connected client count
  getConnectedClientCount() {
    return this.webSocketServer.getClients().filter(client => 
      client.readyState === WebSocket.OPEN
    ).length;
  }

  // Get connected teams statistics
  getConnectionStats() {
    const clients = this.webSocketServer.getClients();
    const connectedTeams = new Set();
    
    clients.forEach(client => {
      if (client.teamName) {
        connectedTeams.add(client.teamName);
      }
    });

    return {
      totalConnections: clients.length,
      activeConnections: clients.filter(c => c.readyState === WebSocket.OPEN).length,
      uniqueTeamsConnected: connectedTeams.size,
      teams: Array.from(connectedTeams)
    };
  }
}

module.exports = LeaderboardService;