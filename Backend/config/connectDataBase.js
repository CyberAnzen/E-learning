const mongoose = require("mongoose");
require("dotenv").config();

const connectDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 20, // adjust as needed
      minPoolSize: 5, // baseline pool
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000, // 45s idle before closing socket
    });

    console.log("✅ MongoDB connected & pool ready");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDataBase;
