const defaultWindow = parseInt(process.env.TIMESTAMP_WINDOW) || 5 * 60 * 1000; // fallback to 5 minutes

exports.TimeStamp = (minutes) => {
  const windowMs = minutes ? minutes * 60 * 1000 : defaultWindow;

  return (req, res, next) => {
    const now = Date.now();
    const timestamp = parseInt(req.headers["timestamp"]);

    if (!timestamp || timestamp > now) {
      return res.status(411).json({ error: "Invalid Request" });
    }

    if (now - timestamp > windowMs) {
      return res.status(411).json({ error: "Request expired" });
    }

    next();
  };
};
