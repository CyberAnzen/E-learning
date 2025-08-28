// middleware/MongoSanitiser.js
const mongoSanitize = require("express-mongo-sanitize");

function MongoSanitizer({ mode = "reject" } = {}) {
  if (mode === "sanitize") {
    // 🔹 Sanitization mode: remove dangerous keys but allow request
    return [
      mongoSanitize({
        replaceWith: "_",
        onSanitize: ({ key }) => {
          console.warn(`⚠️ Sanitized suspicious Mongo key: ${key}`);
        },
      }),
      (req, res, next) => {
        if (req.hasSanitizeWarning) {
          console.warn("⚠️ Mongo sanitize applied");
        }
        next();
      },
    ];
  }

  // 🔹 Reject mode: block if dangerous keys are found
  return (req, res, next) => {
    const hasMongoAttack = (obj) => {
      if (!obj || typeof obj !== "object") return false;
      return Object.keys(obj).some((key) => {
        if (key.includes("$") || key.includes(".")) return true;
        return hasMongoAttack(obj[key]);
      });
    };

    if (
      hasMongoAttack(req.body) ||
      hasMongoAttack(req.query) ||
      hasMongoAttack(req.params)
    ) {
      console.error("❌ Mongo injection attempt blocked:", {
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return res
        .status(400)
        .json({ error: "❌ Malicious Mongo operator detected in request" });
    }

    next();
  };
}

module.exports = { MongoSanitizer };
