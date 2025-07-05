const mongoose = require("mongoose");
require("dotenv").config();
const connectDataBase = () => {
  mongoose.connect(process.env.MONGO_DB).then(() => {
    console.log("MongoDB connected");
  });
};

module.exports = connectDataBase;
