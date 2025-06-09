const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 4000;
const bodyParser = require("body-parser");
const login = require("./router/userRoute");
const event = require("./router/eventRoutes");
const ConnectDataBase = require("./config/connectDataBase");
ConnectDataBase();


// Middleware to handle CORS
//dont change it
const whitelist = [

    'http://localhost:5173'// react app url
    // Add other allowed origins here, e.g. 'https://example.com'
]

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
            callback(null, true); // Allow
        } else {
            callback(new Error("Not allowed by CORS")); // Block
        }
    },
    credentials: true // This allows credentials (cookies, authorization headers, etc.)
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api/event", event);
app.use("/api/user", login);
app.listen(port);
