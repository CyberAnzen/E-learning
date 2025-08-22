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

//routes
const userRoutes = require("./router/userRoutes");
const event = require("./router/eventRoutes");
const lesson = require("./router/lessonRoutes");
const validate = require("./router/ValidationRoutes");
const profile = require("./router/profileRoutes");
const CTF = require("./router/CTFRoutes");
const TeamRoutes = require("./router/TeamRoutes");

const createLogWorker = require("./logger/controller/workerLog");
const ConnectDataBase = require("./config/connectDataBase");
const initializeCaches = require("./cache/initCache");
const classification = require("./router/classificationRoutes");
const csrfProtection = require("./middleware/CSRFprotection");
const requestLogger = require("./middleware/requestLogger");
const errorLogger = require("./middleware/errorLogger");
const gracefulShutdown = require("./utilies/gracefulShutdown");
const FRONTEND_URL = process.env.FRONTEND_URL;

//Database and Cache initialization
ConnectDataBase();
initializeCaches();

// Logger worker setup
const loggerWorker = new Worker("./logger/controller/logger.js");
const logInBackground = createLogWorker(loggerWorker);

// Security Middlewares
app.use(cors({ origin: FRONTEND_URL || true, credentials: true }));
app.use(helmet()); // Adds common security headers

// parser middlewares
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// Rate limiting for static files (prevent abuse)
const downloadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 downloads per IP per minute
  message: "Too many downloads, please slow down.",
});

// Serve only challenge files (not full public folder)
app.use(
  "/files",
  downloadLimiter,
  Auth(),
  express.static(path.join(__dirname, "public/challenges"), {
    dotfiles: "deny", // Prevent access to .env or hidden files
    index: false, // Disable directory indexing
    maxAge: "1h", // Cache for 1 hour
  })
);

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
app.use("/api/user", userRoutes);
app.use("/api/classification", classification);
app.use("/api/lesson", lesson);
app.use("/api/answer", validate);
app.use("/api/profile", profile);
app.use("/api/challenge", CTF);
app.use("/api/image", require("./router/imageRoutes"));
app.use("/api/team", TeamRoutes);

// Error logging
app.use(errorLogger(logInBackground));

app.listen(port, () => {
  console.log(`CTF platform running on port ${port}`);
});

process.on("SIGINT", () => gracefulShutdown(loggerWorker));
process.on("SIGTERM", () => gracefulShutdown(loggerWorker));
