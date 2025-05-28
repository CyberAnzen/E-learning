const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 4000;
const bodyParser = require("body-parser");
const products = require("./router/productRoute");
const login = require("./router/userRoute");
const event = require("./router/eventRoutes");
const ConnectDataBase = require("./config/connectDataBase");
ConnectDataBase();
app.use(
  cors({
    origin: "http://localhost:5173", // explicitly specify your client origin
    credentials: true, // allow cookies to be sent
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api", products);
app.use("/event", event);
app.listen(port);
