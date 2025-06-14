const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 4000;
const bodyParser = require("body-parser");
const login = require("./router/userRoutes");
const event = require("./router/eventRoutes");
const classification = require("./router/classificationRoutes");
const lesson = require("./router/lessonRoutes");
const answer = require("./router/ValidationRoutes");
const ConnectDataBase = require("./config/connectDataBase");
const initializeCaches = require("./cache/initCache")
const helmet = require("helmet");
const xssSanitizer = require("./middleware/xssSanitizer");

ConnectDataBase();
initializeCaches();


// Middleware to handle CORS
//dont change it
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


app.use(helmet()); // Use Helmet for security headers
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api/event",xssSanitizer(), event);
app.use("/api/user",xssSanitizer(), login);
app.use("/api/classification",xssSanitizer(), classification);
app.use("/api/lesson",xssSanitizer(), lesson);
app.use("/api/answer", answer);
app.listen(port);
