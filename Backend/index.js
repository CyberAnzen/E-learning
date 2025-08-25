// index.js
const port = 4000;
require("dotenv").config();
const cluster = require("cluster");
const os = require("os");
const numCPUs = process.env.CLUSTER_WORKERS
  ? Number(process.env.CLUSTER_WORKERS)
  : os.cpus().length || 1;

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
const mongoSanitize = require("express-mongo-sanitize");
const slowDown = require("express-slow-down");

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

const createLogWorker = require("./logger/controller/workerLog");
const classification = require("./router/classificationRoutes");
const csrfProtection = require("./middleware/CSRFprotection");
const requestLogger = require("./middleware/requestLogger");
const errorLogger = require("./middleware/errorLogger");
const gracefulShutdown = require("./utilies/gracefulShutdown");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Fallback to localhost:3000 for development

// Declare server variable here and assign later in worker process
let server;

// Keep the initializeServer function name and behavior intact
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

    // ONLY the worker assigned to run the websocket/leaderboard should do leaderboard init + attach
    // Worker role is provided via process.env.WORKER_ROLE set by the master when forking.
    const role = process.env.WORKER_ROLE || "app"; // defaults to 'app' if not set
    if (role === "ws") {
      // attach leaderboard websocket to same HTTP server (only in ws worker)
      await initLeaderboard(); // Initialize leaderboard from MongoDB
      LeaderboardManager.attachToServer(server);
      console.log(
        `[init] Worker ${process.pid} running role=ws (websocket + leaderboard)`
      );
    } else {
      console.log(
        `[init] Worker ${process.pid} running role=app (regular server)`
      );
    }
  } catch (err) {
    console.error("❌ Initialization error:", err);
    process.exit(1); // Exit if initialization fails
  }
}

// CLUSTER MASTER: fork workers and supervise
if (cluster.isMaster) {
  console.log(`Master ${process.pid} starting. Forking ${numCPUs} worker(s).`);

  for (let i = 0; i < numCPUs; i++) {
    // Assign the first fork as the websocket worker, others as app workers
    const role = i === 0 ? "ws" : "app";
    const env = Object.assign({}, process.env, { WORKER_ROLE: role });
    const w = cluster.fork(env);
    console.log(`Forked worker ${w.process.pid} role=${role}`);
  }

  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.warn(
      `Worker ${worker.process.pid} died (code=${code}, signal=${signal}). Forking replacement.`
    );
    // Maintain same role for replacement: keep the same WORKER_ROLE if possible
    // We fork replacement with default role 'app' to keep it simple; master will still have at least one ws from initial forks
    const newWorker = cluster.fork(
      Object.assign({}, process.env, { WORKER_ROLE: "app" })
    );
    console.log(`Forked replacement worker ${newWorker.process.pid}`);
  });

  // Graceful shutdown: stop workers, then exit master
  const stopAll = () => {
    console.log("Master shutting down workers...");
    for (const id in cluster.workers) {
      try {
        cluster.workers[id].kill("SIGTERM");
      } catch (e) {}
    }
    // allow some time for workers to exit gracefully
    setTimeout(() => process.exit(0), 2000);
  };
  process.on("SIGTERM", stopAll);
  process.on("SIGINT", stopAll);
} else {
  // WORKER PROCESS: setup express app exactly as before
  // create server now inside worker so initializeServer() can attach websockets (in ws worker)
  server = http.createServer(app);

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

  // Logger worker setup (same as your original file)
  const loggerWorker = new Worker("./logger/controller/logger.js");
  const logInBackground = createLogWorker(loggerWorker);

  // Security Middlewares
  // Production CORS configuration (commented out)
  // app.use(
  //   cors({
  //     origin: FRONTEND_URL, // Explicitly set the frontend origin
  //     credentials: true,
  //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  //     allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  //   })
  // );
  app.use(cors({ origin: true, credentials: true })); // Development CORS configuration
  app.use(helmet()); // Adds common security headers

  // Parser middlewares
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: true }));
  app.use(bodyParser.json());
  app.use(mongoSanitize()); // Block NoSQL injection
  const speedLimiter = slowDown({
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 100, // allow 100 requests
    delayMs: () => 500,
  });

  // Rate limiting for static files (prevent abuse)
  const downloadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 downloads per IP per minute
    message: "Too many downloads, please slow down.",
  });

  // Middleware to log requests
  app.use(requestLogger(logInBackground));
  app.use(speedLimiter);

  // CSRF route
  app.get(
    "/api/auth/csrf-token",
    Auth({ _CSRF: false }),
    csrfProtection,
    (req, res) => {
      res.json({ csrfToken: req.csrfToken() });
    }
  );

  // Routes
  // app.use("/api/classification", classification);
  // app.use("/api/lesson", lesson);
  // app.use("/api/answer", validate);
  // app.use("/api/image", require("./router/imageRoutes"));
  // app.use("/api/event", event);

  app.use("/api/user", userRoutes);
  app.use("/api/profile", profile);
  app.use("/api/challenge", CTF);
  app.use("/api/team", TeamRoutes);

  // Serve only challenge files (not full public folder)
  app.use(
    "/",
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
        // Ensure CORS headers are set for static files
        // res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
        res.setHeader("Access-Control-Allow-Methods", "GET");
        res.setHeader("Access-Control-Allow-Headers", "Authorization");
      },
    })
  );

  // Error logging
  app.use(errorLogger(logInBackground));

  // Wait for caches to initialize (same as original)
  // let cachesDone = false;
  // initializeCaches()
  //   .then(() => {
  //     cachesDone = true;
  //   })
  //   .catch((err) => {
  //     throw err;
  //   });
  // deasync.loopWhile(() => !cachesDone);

  server.listen(port, () => {
    console.log(`CTF platform running on port ${port} (worker ${process.pid})`);
  });

  process.on("SIGINT", () => gracefulShutdown(loggerWorker));
  process.on("SIGTERM", () => gracefulShutdown(loggerWorker));
}
