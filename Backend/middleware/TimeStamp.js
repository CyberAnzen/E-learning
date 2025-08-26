const defaultWindow = 5 * 60 * 1000; // 5 minutes

exports.TimeStamp = (minutes) => {
  const windowMs = minutes ? minutes * 60 * 1000 : defaultWindow;

  return (req, res, next) => {
    const now = Date.now();
    const timestamp = parseInt(
      req.headers["timestamp"] || req.headers["Timestamp"]
    );

    if (!timestamp) {
      console.log("Missing timestamp. Current time:", now);
      return res.status(411).json({ error: "Invalid Request" });
    }

    const drift = now - timestamp; // positive if server ahead, negative if client ahead

    if (Math.abs(drift) > windowMs) {
      console.log("Request timestamp outside allowed window:", drift, "ms");
      console.log("Current time:", now, "Client timestamp:", timestamp);
      return res.status(411).json({ error: "Request expired or invalid" });
    }

    next();
  };
};
