const cluster = require("cluster");
const os = require("os");
const port = 4000;
require("dotenv").config();
const express = require("express");
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

const ConnectDataBase = require("./config/connectDataBase");
const { connectRedis } = require("./redis/config/connectRedis");
// const initializeCaches = require("./cache/initCache");
const initLeaderboard = require("./redis/initLeaderboard");
const LeaderboardManager = require("./controller/CTF/LeaderBoard/leaderBoardManager");
const createLogWorker = require("./logger/controller/workerLog");
// const classification = require("./router/classificationRoutes");
const csrfProtection = require("./middleware/CSRFprotection");
const requestLogger = require("./middleware/requestLogger");
const errorLogger = require("./middleware/errorLogger");
const gracefulShutdown = require("./utilies/gracefulShutdown");

const userRoutes = require("./router/userRoutes");
// const event = require("./router/eventRoutes");
// const lesson = require("./router/lessonRoutes");
// const validate = require("./router/ValidationRoutes");
const profile = require("./router/profileRoutes");
const CTF = require("./router/CTFRoutes");
const TeamRoutes = require("./router/TeamRoutes");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(
    `Primary process ${process.pid} is running. Forking ${numCPUs} workers...`
  );

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );
    console.log("Forking a new worker...");
    cluster.fork();
  });
} else {
  // Worker process
  const app = express();
  let server = http.createServer(app);

  async function initializeServer() {
    try {
      await ConnectDataBase();
      await connectRedis();
      await initLeaderboard();
      LeaderboardManager.attachToServer(server);
    } catch (err) {
      console.error(`❌ Worker ${process.pid} initialization error:`, err);
      process.exit(1);
    }
  }

  // Blocking code to wait for server initialization
  let initDone = false;
  initializeServer()
    .then(() => {
      initDone = true;
    })
    .catch((err) => {
      throw err;
    });
  deasync.loopWhile(() => !initDone);

  // Logger worker setup (per worker)
  const loggerWorker = new Worker("./logger/controller/logger.js");
  const logInBackground = createLogWorker(loggerWorker);

  // Security Middlewares
  app.use(cors({ origin: true, credentials: true }));
  app.use(helmet());

  // Parser middlewares
  app.use(cookieParser());
  app.use(express.json());
  app.use(bodyParser.json());

  // Rate limiting for static files
  const downloadLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many downloads, please slow down.",
  });

  // Middleware to log requests
  app.use(requestLogger(logInBackground));

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

  // Serve static challenge files
  app.use(
    "/",
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

  // Error logging
  app.use(errorLogger(logInBackground));

  // Cache initialization
  // let cachesDone = false;
  // initializeCaches()
  //   .then(() => {
  //     cachesDone = true;
  //   })
  //   .catch((err) => {
  //     throw err;
  //   });
  // deasync.loopWhile(() => !cachesDone);

  // Start server
  server.listen(port, () => {
    console.log(`Worker ${process.pid} running CTF platform on port ${port}`);
  });

  // Handle graceful shutdown
  process.on("SIGINT", () => gracefulShutdown(loggerWorker));
  process.on("SIGTERM", () => gracefulShutdown(loggerWorker));
}
