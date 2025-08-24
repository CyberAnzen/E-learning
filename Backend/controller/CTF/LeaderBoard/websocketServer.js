// websocketServer.js
const WebSocket = require("ws");

// Heartbeat interval
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

class WebSocketLeaderboardServer {
  constructor() {
    this.wss = new WebSocket.Server({ noServer: true });
    this.eventHandlers = {}; // ✅ Store multiple event handlers
    this.initializeWebSocket();
  }

  initializeWebSocket() {
    // Handle new connections
    this.wss.on("connection", (ws, request) => {
      this.handleConnection(ws, request);
    });

    // Setup heartbeat
    this.setupHeartbeat();
  }

  handleConnection(ws, request) {
    console.log("Client connected:", request.socket.remoteAddress);

    ws.isAlive = true;
    ws.teamName = null;

    // Setup event listeners
    this.emit("clientConnected", ws);

    ws.on("message", (message) => this.handleMessage(ws, message));
    ws.on("pong", () => { ws.isAlive = true; });
    ws.on("close", () => this.handleClose(ws));
    ws.on("error", (err) => this.handleError(ws, err));
  }

  async handleMessage(ws, message) {
    try {
      const msg = JSON.parse(message);
      
      if (msg.type === "REGISTER_TEAM" && msg.teamName) {
        ws.teamName = msg.teamName;
        console.log(`Team registered: ${ws.teamName}`);
        
        // ✅ Properly trigger event with all registered handlers
        this.emit('teamRegistered', ws);
      }
    } catch (err) {
      console.error("WebSocket message error:", err);
    }
  }

  handleClose(ws) {
    console.log(`Client disconnected${ws.teamName ? ` (Team: ${ws.teamName})` : ''}`);
  }

  handleError(ws, err) {
    console.error(`WebSocket error for ${ws.teamName || 'unknown client'}:`, err);
  }

  setupHeartbeat() {
    setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
      });
    }, HEARTBEAT_INTERVAL);
  }

  // Attach to HTTP server
  attachToServer(server, path = "/ws/leaderboard") {
    server.on("upgrade", (request, socket, head) => {
      if (request.url.startsWith(path)) {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.wss.emit("connection", ws, request);
        });
      } else {
        socket.destroy();
      }
    });
  }

  // ✅ Improved event handling
  on(event, callback) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(callback);
    console.log(`Registered handler for event: ${event}`);
  }

  // ✅ Emit events to all registered handlers
  emit(event, data) {
    if (this.eventHandlers[event]) {
      console.log(`Emitting event: ${event} to ${this.eventHandlers[event].length} handlers`);
      this.eventHandlers[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    } else {
      console.log(`No handlers registered for event: ${event}`);
    }
  }

  // Get all connected clients
  getClients() {
    return Array.from(this.wss.clients);
  }

  // Get clients by team name
  getClientsByTeam(teamName) {
    return this.getClients().filter(client => 
      client.readyState === WebSocket.OPEN && client.teamName === teamName
    );
  }
}

module.exports = WebSocketLeaderboardServer;