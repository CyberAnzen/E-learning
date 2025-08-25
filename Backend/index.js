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
const {
  connectRedis,
  disconnectRedis,
  getRedisClient,
} = require("./redis/config/connectRedis");
const initializeCaches = require("./cache/initCache");
const initLeaderboard = require("./redis/initLeaderboard"); // should be idempotent for master run
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

// server variable declared here and will be created in worker processes
let server;

/**
 * MASTER-ONLY: Perform one-time heavy initialization here:
 *  - connect to database (temporary)
 *  - connect to redis (temporary)
 *  - initialize caches and populate leaderboard in redis
 *
 * After this completes, master will close the temporary connections and fork workers.
 *
 * NOTE: workers will still call ConnectDataBase() to open process-local DB connections to handle requests.
 */
async function masterInitOnce() {
  console.log(`[master:${process.pid}] running one-time initialization...`);
  try {
    // Temporary DB connection so we can run any DB initialization tasks (migrations / seeding)
    await ConnectDataBase();
    console.log(`[master:${process.pid}] MongoDB connected for init.`);

    // Connect temporary Redis (ensure your connectRedis returns a redis client or exposes disconnect)
    await connectRedis();
    console.log(`[master:${process.pid}] Redis connected for init.`);

    // Initialize caches / seed caches
    try {
      await initializeCaches();
      console.log(`[master:${process.pid}] Caches initialized.`);
    } catch (err) {
      console.warn(
        `[master:${process.pid}] initializeCaches failed (continuing):`,
        err.message || err
      );
    }

    // Initialize leaderboard from MongoDB into Redis (idempotent expected)
    try {
      await initLeaderboard();
      console.log(`[master:${process.pid}] initLeaderboard completed.`);
    } catch (err) {
      console.warn(
        `[master:${process.pid}] initLeaderboard failed (continuing):`,
        err.message || err
      );
    }

    // Close master DB + Redis connections (workers will create their own)
    try {
      // mongoose disconnect (if you use mongoose)
      const mongoose = require("mongoose");
      if (mongoose && mongoose.connection && mongoose.connection.readyState) {
        await mongoose.disconnect();
        console.log(`[master:${process.pid}] master mongoose disconnected.`);
      }
    } catch (err) {
      console.warn(
        `[master:${process.pid}] error disconnecting mongoose:`,
        err.message || err
      );
    }

    try {
      // If your redis module exposes a disconnect helper, call it
      if (typeof disconnectRedis === "function") {
        await disconnectRedis();
        console.log(`[master:${process.pid}] master redis disconnected.`);
      } else {
        // fallback: try to get client and quit
        const client = getRedisClient && getRedisClient();
        if (client && typeof client.quit === "function") {
          await client.quit();
          console.log(`[master:${process.pid}] master redis client quit.`);
        }
      }
    } catch (err) {
      console.warn(
        `[master:${process.pid}] error disconnecting redis:`,
        err.message || err
      );
    }

    console.log(`[master:${process.pid}] one-time initialization finished.`);
    return true;
  } catch (err) {
    console.error(`[master:${process.pid}] initialization error:`, err);
    return false;
  }
}

/**
 * WORKER: initializeServerWorker
 * This keeps your original initializeServer behavior for the worker that needs to attach the leaderboard websocket.
 * Workers will still need to create their own DB connections for serving requests.
 */
async function initializeServerWorker(serverInstance) {
  try {
    // Connect DB for this worker process (needed to serve requests).
    await ConnectDataBase();
    // connectRedis per worker (if your app expects it)
    await connectRedis();
    console.log(`[worker:${process.pid}] DB and Redis connected for worker.`);

    // Only the worker designated as 'ws' will attach leaderboard websocket to its HTTP server
    const role = process.env.WORKER_ROLE || "app";
    if (role === "ws") {
      try {
        // NOTE: initLeaderboard was already executed by master to populate redis.
        // Here, attach websocket handlers to this worker's server.
        LeaderboardManager.attachToServer(serverInstance);
        console.log(
          `[worker:${process.pid}] Attached leaderboard/websocket (role=ws).`
        );
      } catch (err) {
        console.error(
          `[worker:${process.pid}] failed to attach leaderboard:`,
          err
        );
      }
    }

    return true;
  } catch (err) {
    console.error(`[worker:${process.pid}] initializeServerWorker error:`, err);
    throw err;
  }
}

// CLUSTER MASTER: perform one-time initialization then fork workers
if (cluster.isMaster) {
  (async () => {
    const ok = await masterInitOnce();
    if (!ok) {
      console.error(
        `[master:${process.pid}] master initialization failed — aborting start.`
      );
      process.exit(1);
    }

    console.log(
      `Master ${process.pid} starting. Forking ${numCPUs} worker(s).`
    );

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
      // Keep it simple: replacement gets 'app' role. If you need to preserve roles, add mapping.
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
  })();
} else {
  // WORKER PROCESS: setup express app exactly as before
  server = http.createServer(app);

  // NOTE: We removed the previous deasync loop that waited for initializeServer() in each worker.
  // Instead, workers perform their own minimal init (DB + redis) quickly and attach leaderboard only if role=ws.
  // If you still want to block until worker init is done, we keep same pattern but per-worker.

  // Block until worker-specific init finishes (keeps original deasync synchronization behaviour)
  let initDone = false;
  initializeServerWorker(server)
    .then(() => {
      initDone = true;
    })
    .catch((err) => {
      console.error(
        `[worker:${process.pid}] failed to initialize worker:`,
        err
      );
      process.exit(1);
    });
  deasync.loopWhile(() => !initDone);

  // Logger worker setup (same as your original file)
  const loggerWorker = new Worker("./logger/controller/logger.js");
  const logInBackground = createLogWorker(loggerWorker);

  // Security Middlewares
  // Development CORS config (keep original)
  app.use(cors({ origin: true, credentials: true }));
  app.use(helmet()); // Adds common security headers

  // Parser middlewares
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: true }));
  app.use(bodyParser.json());
  app.use(mongoSanitize()); // Block NoSQL injection

  // express-slow-down v2 usage (use constant delay)
  const speedLimiter = slowDown({
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 100, // allow 100 requests
    delayMs: () => 500, // fixed 500ms per extra request (v2 compatible)
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
        res.setHeader("Access-Control-Allow-Methods", "GET");
        res.setHeader("Access-Control-Allow-Headers", "Authorization");
      },
    })
  );

  // Error logging
  app.use(errorLogger(logInBackground));

  // IMPORTANT: you requested "connect the db once init once".
  // Master performed the heavy init. Workers still need a DB connection each to serve requests.
  // If you prefer the worker to avoid connecting in some cases, modify ConnectDataBase accordingly.
  // For now we proceed to start listening.
  server.listen(port, () => {
    console.log(`CTF platform running on port ${port} (worker ${process.pid})`);
  });

  process.on("SIGINT", () => gracefulShutdown(loggerWorker));
  process.on("SIGTERM", () => gracefulShutdown(loggerWorker));
}
