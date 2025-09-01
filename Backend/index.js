// server.js
const port = 4000;
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const { Auth } = require("./middleware/Auth");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { Worker } = require("worker_threads");
const path = require("path");
const rateLimit = require("express-rate-limit");
const http = require("http");

// Keep your original initializers
const ConnectDataBase = require("./config/connectDataBase");
const { connectRedis } = require("./redis/config/connectRedis");
const initializeCaches = require("./cache/initCache");
const initLeaderboard = require("./redis/initLeaderboard");
const LeaderboardManager = require("./controller/CTF/LeaderBoard/leaderBoardManager");

// Routes & middleware
const userRoutes = require("./router/userRoutes");
const event = require("./router/eventRoutes");
const lesson = require("./router/lessonRoutes");
const validate = require("./router/ValidationRoutes");
const profile = require("./router/profileRoutes");
const CTF = require("./router/CTFRoutes");
const TeamRoutes = require("./router/TeamRoutes");
const createLogWorker = require("./logger/controller/workerLog");
const classification = require("./router/classificationRoutes");
const csrfProtection = require("./middleware/CSRFprotection");
const requestLogger = require("./middleware/requestLogger");
const errorLogger = require("./middleware/errorLogger");
const gracefulShutdown = require("./utilies/gracefulShutdown");

const FRONTEND_URL = "https://cyberanzen.netlify.app";

let server = http.createServer(app);
let isReady = false; // for /health

// ========== Logger worker ==========
const loggerWorker = new Worker("./logger/controller/logger.js");
const logInBackground = createLogWorker(loggerWorker);

// =======================
// === CORS (PERMISSIVE) ===
// =======================
// TEMPORARY: allow all origins to avoid CORS blocking while debugging.
// WARNING: revert to a specific origin (your FRONTEND_URL) before production.
app.use(cors()); // <--- permissive CORS
app.options("*", cors()); // preflight handler for all routes

// (optional) enable helmet if you want extra security headers
// app.use(helmet());

// ========== Parsers ==========
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// ========== Rate limiting for downloads ==========
const downloadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many downloads, please slow down.",
});

// ========== Request logging middleware ==========
app.use(requestLogger(logInBackground));

// ========== Static files (protected) ==========
app.use(
  "/public",
  downloadLimiter,
  Auth({ timestamp: false }),
  express.static(path.join(__dirname, "public/"), {
    dotfiles: "deny",
    index: false,
    maxAge: "1h",
    setHeaders: (res, filePath) => {
      const fileName = path.basename(filePath);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("X-Content-Type-Options", "nosniff");
      // Allow cross-origin GET for frontend if needed
      res.setHeader("Access-Control-Allow-Methods", "GET");
      res.setHeader("Access-Control-Allow-Headers", "Authorization");
    },
  })
);

// ========== Routes ==========
app.use("/api/user", userRoutes);
app.use("/api/profile", profile);
app.use("/api/challenge", CTF);
app.use("/api/team", TeamRoutes);

// CSRF Token route (ensure CORS applied)
app.get(
  "/api/auth/csrf-token",
  Auth({ _CSRF: false }),
  csrfProtection,
  (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  }
);

// Health endpoint
app.get("/health", (req, res) => {
  if (isReady) return res.status(200).json({ ready: true });
  return res.status(503).json({ ready: false });
});

// ========== Error logging ==========
app.use(errorLogger(logInBackground));

// ========== Global error handler ==========
app.use((err, req, res, next) => {
  console.error("❌ Express error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ========== Init functions ==========
async function initializeServer() {
  console.log("⏳ Initialization started...");
  try {
    await ConnectDataBase();
    console.log("✅ MongoDB connected");

    await connectRedis();
    console.log("✅ Redis connected");

    await initLeaderboard();
    console.log("✅ Leaderboard initialized via Redis/Mongo");
  } catch (err) {
    console.error("❌ Initialization error:", err);
    throw err;
  }
}

async function initializeCachesSafe() {
  try {
    await initializeCaches();
    console.log("✅ Caches initialized");
  } catch (err) {
    console.error("❌ Cache initialization error:", err);
    throw err;
  }
}

// ========== Start sequence ==========
async function start() {
  try {
    await initializeServer();
    await initializeCachesSafe();

    server.listen(port, () => {
      console.log(`🚀 CTF platform running on port ${port}`);
      // attach websocket/leaderboard after server is listening
      try {
        LeaderboardManager.attachToServer(server);
        console.log("✅ Leaderboard socket attached");
      } catch (err) {
        console.error("❌ Error attaching leaderboard:", err);
        // don't crash the server — log and continue (or process.exit depending on your policy)
      }
      isReady = true;
    });
  } catch (err) {
    console.error("Fatal init error, exiting:", err);
    // If init fails, keep logs, give Cloudflare a chance to see failure, then exit
    process.exit(1);
  }
}
start();

// ========== Process-level handlers ==========
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
  // optional: process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // optional: process.exit(1);
});

process.on("SIGINT", () => gracefulShutdown(loggerWorker));
process.on("SIGTERM", () => gracefulShutdown(loggerWorker));
