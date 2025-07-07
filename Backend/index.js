const port = 4000;
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRoutes = require("./router/userRoutes");
const event = require("./router/eventRoutes");
const lesson = require("./router/lessonRoutes");
const validate = require("./router/ValidationRoutes");
const ConnectDataBase = require("./config/connectDataBase");
const initializeCaches = require("./cache/initCache");
const xssSanitizer = require("./middleware/xssSanitizer");
const classification = require("./router/classificationRoutes");
const csrfProtection = require("./middleware/CSRFprotection");

//Database and Cache initialization
ConnectDataBase();
initializeCaches();

//Security Middlewares
// Middleware to handle CORS
const whitelist = [
  "http://localhost:5173", // react app url
  // Add other allowed origins here, e.g. 'https://example.com'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true); // Allow
    } else {
      callback(new Error("Not allowed by CORS")); // Block
    }
  },
  credentials: true, // This allows credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

// app.use(cors());
// app.use(helmet()); // Use Helmet for security headers

// parser middlewares
app.use(cookieParser());
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json());

app.use(express.static("public")); // Serve static files from the 'public' directory

// Routes starts here
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api/event", xssSanitizer(), event);
app.use("/api/user", userRoutes);
app.use("/api/classification", xssSanitizer(), classification);
app.use("/api/lesson", lesson);
app.use("/api/answer", validate);

app.use("/api/image", require("./router/imageRoutes"));

app.listen(port);
