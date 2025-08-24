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

// Routes
const userRoutes = require("./router/userRoutes");
const event = require("./router/eventRoutes");
const lesson = require("./router/lessonRoutes");
const validate = require("./router/ValidationRoutes");
const profile = require("./router/profileRoutes");
const CTF = require("./router/CTFRoutes");
const TeamRoutes = require("./router/TeamRoutes");

const createLogWorker = require("./logger/controller/workerLog");
const ConnectDataBase = require("./config/connectDataBase");
const { connectRedis } = require("./redis/config/connectRedis");
const initializeCaches = require("./cache/initCache");
const classification = require("./router/classificationRoutes");
const csrfProtection = require("./middleware/CSRFprotection");
const requestLogger = require("./middleware/requestLogger");
const errorLogger = require("./middleware/errorLogger");
const gracefulShutdown = require("./utilies/gracefulShutdown");
const initLeaderboardSocket = require("./controller/CTF/LeaderBoard/leaderboardSocket");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Fallback to localhost:3000 for development
const server = http.createServer(app);

// Database and Cache initialization
ConnectDataBase();

/*
  Redis connection
  Make sure to start Redis server before running the application.
  if u dont want to use redis, comment the line below
*/
connectRedis();
// attach leaderboard websocket to same HTTP server

initLeaderboardSocket(server);

initializeCaches();

// Logger worker setup
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
app.use("/api/event", event);
// app.use("/api/event", xssSanitizer(), event);
app.use("/api/user", userRoutes);
app.use("/api/classification", classification);
app.use("/api/lesson", lesson);
app.use("/api/answer", validate);
app.use("/api/profile", profile);
app.use("/api/challenge", CTF);
app.use("/api/image", require("./router/imageRoutes"));
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
// app.post("/api/auth/verify-captcha", async (req, res) => {
//   try {
//     const token = req.body["cf-turnstile-response"]; // comes from form
//     if (!token) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No captcha token" });
//     }

//     const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         secret: process.env.CF_SECRET_KEY,
//         response: token,
//         remoteip: req.ip,
//       }),
//     });

//     const data = await response.json();

//     if (data.success) {
//       return res.json({ success: true, message: "Captcha verified ✅" });
//     } else {
//       return res
//         .status(403)
//         .json({ success: false, message: "Captcha failed ❌" });
//     }
//   } catch (err) {
//     console.error("Captcha error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// Error logging
app.use(errorLogger(logInBackground));

// app.listen(port, () => {
//   console.log(`CTF platform running on port ${port}`);
// });
server.listen(port, () => {
  console.log(`CTF platform running on port ${port}`);
});
process.on("SIGINT", () => gracefulShutdown(loggerWorker));
process.on("SIGTERM", () => gracefulShutdown(loggerWorker));
