// server.js
const port = 4000;
require("dotenv").config();
const express = require("express");
const app = express();
// const cors = require("cors"); // REMOVED
const helmet = require("helmet");
const { Auth } = require("./middleware/Auth");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { Worker } = require("worker_threads");
const path = require("path");
const rateLimit = require("express-rate-limit");
const http = require("http");
const deasync = require("deasync");
const mongoSanitize = require("express-mongo-sanitize");
const ConnectDataBase = require("./config/connectDataBase");
const { connectRedis } = require("./redis/config/connectRedis");
const initializeCaches = require("./cache/initCache");
const initLeaderboard = require("./redis/initLeaderboard");
const LeaderboardManager = require("./controller/CTF/LeaderBoard/leaderBoardManager");
const { MongoSanitizer } = require("./middleware/Mongosanitiser");
// initLeaderboardSocket(server);

async function initializeServer() {
  try {
    await ConnectDataBase();
    // Database and Cache initialization

    /*
      Redis connection
      Make sure to start Redis server before running the application.
      if u dont want to use redis, comment the line below
    */
    await connectRedis();
    // attach leaderboard websocket to same HTTP server

    await initLeaderboard(); // Initialize leaderboard from MongoDB
    LeaderboardManager.attachToServer(server);
  } catch (err) {
    console.error("❌ Initialization error:", err);
    process.exit(1); // Exit if initialization fails
  }
}

// Routes
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

const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://cyberanzen.netlify.app";

let server = http.createServer(app);

//*************************************************************************** */
///blocking code to wait for caches to initialize
// Start server after initialization
let initDone = false;
initializeServer()
  .then(() => {
    initDone = true;
  })
  .catch((err) => {
    throw err;
  });
deasync.loopWhile(() => !initDone);
//-***************************************************************************************

// Logger worker setup
const loggerWorker = new Worker("./logger/controller/logger.js");
const logInBackground = createLogWorker(loggerWorker);

// Note: CORS has been removed intentionally per request.
// If you need cross-origin browser access, you'll need to enable CORS or proxy requests.

// app.use(helmet()); // Adds common security headers

// Parser middlewares
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// Rate limiting for static files (prevent abuse)
const downloadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 downloads per IP per minute
  message: "Too many downloads, please slow down.",
});

// Middleware to log requests
app.use(requestLogger(logInBackground));
// Strict reject (default)
app.use(MongoSanitizer());

// OR allow sanitization (kept as you had it)
app.use(MongoSanitizer({ mode: "sanitize" }));

// Serve only challenge files (not full public folder)
// Note: removed Access-Control-Allow-* headers so browsers from other origins will be blocked
app.use(
  "/public",
  downloadLimiter,
  Auth({ timestamp: false }),
  express.static(path.join(__dirname, "public/"), {
    dotfiles: "deny", // Prevent access to hidden files
    index: false, // Disable directory listing
    maxAge: "1h", // Cache for 1 hour
    setHeaders: (res, filePath) => {
      const fileName = path.basename(filePath);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("X-Content-Type-Options", "nosniff");

      // NOTE: removed Access-Control-Allow-* headers to disable CORS entirely
      // If you later want to enable CORS for static files, add:
      // res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
      // res.setHeader("Access-Control-Allow-Credentials", "true");

      // methods and headers for completeness (these are harmless server headers)
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Authorization, X-CSRF-Token, Content-Type"
      );
    },
  })
);

// Routes
// app.use("/api/classification", classification);
// app.use("/api/lesson", lesson);
// app.use("/api/answer", validate);
// app.use("/api/image", require("./router/imageRoutes"));
// app.use("/api/event", event);

// app.use("/api/event", xssSanitizer(), event);
app.use("/api/user", userRoutes);
app.use("/api/profile", profile);
app.use("/api/challenge", CTF);
app.use("/api/team", TeamRoutes);

// CSRF route
app.get(
  "/api/auth/csrf-token",
  Auth({ _CSRF: false }),
  csrfProtection,
  (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  }
);

// Error logging
app.use(errorLogger(logInBackground));

// Wait for caches initialization (blocking)
let cachesDone = false;
initializeCaches()
  .then(() => {
    cachesDone = true;
  })
  .catch((err) => {
    throw err;
  });
deasync.loopWhile(() => !cachesDone);

// Generic error handler
app.use((err, req, res, next) => {
  console.error("❌ Express error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

server.listen(port, () => {
  console.log(`CTF platform running on port ${port}`);
});
process.on("SIGINT", () => gracefulShutdown(loggerWorker));
process.on("SIGTERM", () => gracefulShutdown(loggerWorker));
