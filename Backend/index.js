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
const deasync = require("deasync");

// Database & Cache
const ConnectDataBase = require("./config/connectDataBase");
const { connectRedis } = require("./redis/config/connectRedis");
const initializeCaches = require("./cache/initCache");
const initLeaderboard = require("./redis/initLeaderboard");
const LeaderboardManager = require("./controller/CTF/LeaderBoard/leaderBoardManager");

// Routes
const userRoutes = require("./router/userRoutes");
const event = require("./router/eventRoutes");
const lesson = require("./router/lessonRoutes");
const validate = require("./router/ValidationRoutes");
const profile = require("./router/profileRoutes");
const CTF = require("./router/CTFRoutes");
const TeamRoutes = require("./router/TeamRoutes");
const classification = require("./router/classificationRoutes");

// Logger + Middleware
const createLogWorker = require("./logger/controller/workerLog");
const csrfProtection = require("./middleware/CSRFprotection");
const requestLogger = require("./middleware/requestLogger");
const errorLogger = require("./middleware/errorLogger");
const gracefulShutdown = require("./utilies/gracefulShutdown");

const FRONTEND_URL = "https://cyberanzen.netlify.app";

let server = http.createServer(app);

// ========================== Initialization ==========================
async function initializeServer() {
  try {
    await ConnectDataBase(); // MongoDB
    await connectRedis(); // Redis
    await initLeaderboard(); // Load leaderboard from DB
    LeaderboardManager.attachToServer(server);
  } catch (err) {
    console.error("❌ Initialization error:", err);
    process.exit(1);
  }
}

let initDone = false;
initializeServer()
  .then(() => (initDone = true))
  .catch((err) => {
    throw err;
  });
deasync.loopWhile(() => !initDone);

// ========================== Logger Worker ==========================
const loggerWorker = new Worker("./logger/controller/logger.js");
const logInBackground = createLogWorker(loggerWorker);

// ========================== Security & CORS ==========================
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-CSRF-Token",
    "User-Agent",
    "Timestamp",
    "timestamp",
    "x-client-fp",
    "csrf-token",
  ],
  optionsSuccessStatus: 200,
};

app.use("/api", cors(corsOptions));
app.options("/api/*", cors(corsOptions));

// app.use(helmet()); // Uncomment if you want extra headers

// ========================== Parsers ==========================
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// ========================== Rate Limiting ==========================
const downloadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many downloads, please slow down.",
});

// ========================== Request Logging ==========================
app.use(requestLogger(logInBackground));

// ========================== Static File Serving ==========================
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
      res.setHeader("Access-Control-Allow-Methods", "GET");
      res.setHeader("Access-Control-Allow-Headers", "Authorization");
    },
  })
);

// ========================== Routes ==========================
// app.use("/api/classification", classification);
// app.use("/api/lesson", lesson);
// app.use("/api/answer", validate);
// app.use("/api/image", require("./router/imageRoutes"));
// app.use("/api/event", event);

app.use("/api/user", userRoutes);
app.use("/api/profile", profile);
app.use("/api/challenge", CTF);
app.use("/api/team", TeamRoutes);

// CSRF Token route
app.get(
  "/api/auth/csrf-token",
  Auth({ _CSRF: false }),
  csrfProtection,
  (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  }
);

// ========================== Error Logging ==========================
app.use(errorLogger(logInBackground));

// ========================== Cache Initialization ==========================
let cachesDone = false;
initializeCaches()
  .then(() => (cachesDone = true))
  .catch((err) => {
    throw err;
  });
deasync.loopWhile(() => !cachesDone);

// ========================== Global Error Handler ==========================
app.use((err, req, res, next) => {
  console.error("❌ Express error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ========================== Start Server ==========================
server.listen(port, () => {
  console.log(`🚀 CTF platform running on port ${port}`);
});

// ========================== Graceful Shutdown ==========================
process.on("SIGINT", () => gracefulShutdown(loggerWorker));
process.on("SIGTERM", () => gracefulShutdown(loggerWorker));
