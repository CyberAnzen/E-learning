const WebSocket = require("ws");

let leaderboard = [
  { id: 1, team: "Redax", score: 1580, solves: 42 },
  { id: 2, team: "NullPointer", score: 1450, solves: 39 },
];

function initLeaderboardSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected to leaderboard");
    ws.send(JSON.stringify(leaderboard));

    ws.on("close", () => console.log("Client disconnected"));
  });

  setInterval(() => {
    leaderboard[0].score += Math.floor(Math.random() * 50);
    leaderboard[0].solves += 1;

    const payload = JSON.stringify({ type: "update", payload: leaderboard[0] });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    });
  }, 10000);
}

module.exports = initLeaderboardSocket;
