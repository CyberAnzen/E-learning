const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 4000;
const bodyParser = require("body-parser");
const userRoutes = require("./router/userRoutes");
// const event = require("./router/eventRoutes");
const classification = require("./router/classificationRoutes");
const lesson = require("./router/lessonRoutes");
const validate = require("./router/ValidationRoutes");

const ConnectDataBase = require("./config/connectDataBase");
const initializeCaches = require("./cache/initCache");
const helmet = require("helmet");
const xssSanitizer = require("./middleware/xssSanitizer");

ConnectDataBase();
initializeCaches();
// app.use(cors());

// Middleware to handle CORS
const whitelist = [
  "https://cyberanzen.netlify.app", // react app url
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

// app.use(helmet()); // Use Helmet for security headers
app.use(cors(corsOptions));

app.use(express.static("public")); // Serve static files from the 'public' directory
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());
app.use(bodyParser.json());
// app.use("/api/event", xssSanitizer(), event);
app.use("/api/user", userRoutes);
app.use("/api/classification", xssSanitizer(), classification);
// app.use("/api/event", xssSanitizer(), event);
// app.use("/api/user", xssSanitizer(), userRoutes);
app.use("/api/lesson", lesson);
app.use("/api/answer", validate);

app.use("/api/image", require("./router/imageRoutes"));

app.listen(port);

