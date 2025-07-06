const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  ip: String,
  ua: { type: String, required: true },
  fp: { type: String, required: true }, // fingerprint hash
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// Auto-delete documents after expiration
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Optional: Index for quick lookup of tokens per user
schema.index({ userId: 1 });

// Optional: For fast deletion or validation of token per device
schema.index({ userId: 1, fp: 1 });

module.exports = mongoose.model("RefreshToken", schema);
