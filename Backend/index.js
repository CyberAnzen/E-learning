const port = 4000;
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const { Auth } = require("./middleware/Auth");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

//routes
const userRoutes = require("./router/userRoutes");
const event = require("./router/eventRoutes");
const lesson = require("./router/lessonRoutes");
const validate = require("./router/ValidationRoutes");
const profile = require("./router/profileRoutes");


const ConnectDataBase = require("./config/connectDataBase");
const initializeCaches = require("./cache/initCache");
const classification = require("./router/classificationRoutes");
const csrfProtection = require("./middleware/CSRFprotection");
const FRONTEND_URL = process.env.FRONTEND_URL;
//Database and Cache initialization
ConnectDataBase();
initializeCaches();

// //Security Middlewares
// // Middleware to handle CORS
// const whitelist = [
//   FRONTEND_URL, // react app url
//   // Add other allowed origins here, e.g. 'https://example.com'
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.includes(origin) || !origin) {
//       callback(null, true); // Allow
//     } else {
//       callback(new Error("Not allowed by CORS")); // Block
//     }
//   },
//   credentials: true, // This allows credentials (cookies, authorization headers, etc.)
// };
// app.use(cors(corsOptions));
app.use(cors({ origin: true, credentials: true }));

// app.use(cors());
// app.use(helmet()); // Use Helmet for security headers

// parser middlewares
app.use(cookieParser());
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json());

app.use(express.static("public")); // Serve static files from the 'public' directory

//CSRF route

app.get(
  "/api/auth/csrf-token",
  Auth({ _CSRF: false }),
  csrfProtection,
  (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  }
);

// Routes starts here

app.use("/api/event", event);
app.use("/api/user", userRoutes);
app.use("/api/classification", classification);
app.use("/api/lesson", lesson);
app.use("/api/answer", validate);

app.use("/api/profile", profile);

app.use("/api/image", require("./router/imageRoutes"));

app.listen(port);
