const defaultWindow = parseInt(process.env.TIMESTAMP_WINDOW) || 5 * 60 * 1000; // fallback to 5 minutes
const mode = process.env.NODE_ENV || "PRO";

exports.TimeStamp = (minutes) => {
  const windowMs = minutes ? minutes * 60 * 1000 : defaultWindow;

  return (req, res, next) => {
    const now = Date.now();
    const timestamp = parseInt(
      req.headers["timestamp"] || req.headers["Timestamp"]
    );

    if (!timestamp || timestamp > now) {
      if (mode === "DEV") {
        console.log("Invalid timestamp:", timestamp, "Current time:", now);
      }
      return res.status(411).json({ error: "Invalid Request" });
    }

    if (now - timestamp > windowMs) {
      console.log("Request expired:", now - timestamp, "ms");
      console.log("Current time:", now, "Timestamp:", timestamp);
      return res.status(411).json({ error: "Request expired" });
    }

    next();
  };
};
