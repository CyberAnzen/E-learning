const jwt = require("jsonwebtoken");
const RefreshToken = require("../model/RefreshTokenModel");
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const csrfProtection = require("../middleware/CSRFprotection");
const TIMESTAMP_WINDOW = 5 * 60 * 1000; // 5 minutes in ms
const ClearCookies = async (res) => {
  // Clear the token cookie
  res.cookie("access_token", "", {
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "Lax",
  });

  // Clear the rememberMe cookie
  res.cookie("refresh_token", "", {
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "Lax",
  });
  // Clear the CSRF token
  res.cookie("_csrf", "", {
    expires: new Date(0),
    path: "/",
    httpOnly: false, // CSRF tokens are usually accessible by JS
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
};
exports.Auth = (options = {}) => {
  return async (req, res, next) => {
    //Timestamp Checking to prevent Replay attack
    const CSRF = options?._CSRF || true;
    const now = Date.now();
    const timestamp = req.headers["timestamp"];
    if (!timestamp || timestamp > now) {
      return res.status(404).json({ error: "Invalid Request" });
    }
    if (now - timestamp > TIMESTAMP_WINDOW) {
      return res.status(400).json({ error: "Request expired" });
    }

    // Apply CSRF protection
    if (CSRF) {
      try {
        await new Promise((resolve, reject) => {
          csrfProtection(req, res, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      } catch (err) {
        return res
          .status(402)
          .json({ message: "Invalid or missing CSRF token" });
      }
    }

    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;
    const fp = req.headers["x-client-fp"] || req.headers["X-Client-Fp"];
    const ua = req.headers["user-agent"] || req.headers["User-Agent"];
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    // console.log(ip, ua, fp, accessToken, refreshToken, req.cookies);
    if (!refreshToken) {
      ClearCookies(res);
      return res.status(401).json({ message: "Refresh token missing" });
    }
    //CASE:Auth Middleware for authorisation
    try {
      if (accessToken) {
        // Try to verify access token
        const decoded = jwt.verify(accessToken, ACCESS_SECRET);
        req.user = decoded;
        //  Use the passed-in options
        if (options?.requireAdmin && req.user.role !== "Admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        return next();
      }
    } catch (err) {
      // Only continue if token is expired (otherwise it's a bad token)
      if (err.name !== "TokenExpiredError") {
        ClearCookies(res);
        return res.status(401).json({ message: "Invalid access token" });
      }
    }

    //CASE:Refreshing the Access Token

    try {
      const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET);
      const stored = await RefreshToken.findOne({
        token: refreshToken,
        userId: decodedRefresh.id,
      });

      if (!stored) {
        return res.status(403).json({ message: "Session not found" });
      }
      // If no access token or expired, check refresh token
      if (!fp || !accessToken) {
        ClearCookies(res);
        if (stored) await stored.deleteOne();

        return res.status(401).json({ message: "Not authorized" });
      }

      if (stored.fp !== fp || stored.ua !== ua) {
        if (stored) await stored.deleteOne();
        ClearCookies(res);
        return res.status(401).json({ message: "Session invalidated" });
      }
      if (stored.expiresAt < Date.now()) {
        await stored.deleteOne();
        ClearCookies(res);
        return res.status(401).json({ message: "Refresh token expired" });
      }

      if (
        !stored.rememberMe &&
        stored.expiresAt - Date.now() < 30 * 60 * 1000
      ) {
        const refresh_token = jwt.sign(
          {
            id: decodedRefresh.id,
            username: decodedRefresh.username,
            role: decodedRefresh.role,
          },
          REFRESH_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          maxAge: 3600000,
        });
        stored.ip = ip;
        stored.token = refresh_token;
        stored.lastUsed = Date.now();
        stored.expiresAt = Date.now() + 3600000;
        await stored.save();
      }
      if (stored.rememberMe) {
        const remainingTime = stored.expiresAt - Date.now();
        if (remainingTime < 7 * 24 * 60 * 60 * 1000) {
          // Less than 7 days left → extend by 20 days
          const refresh_token = jwt.sign(
            {
              id: decodedRefresh.id,
              username: decodedRefresh.username,
              role: decodedRefresh.role,
            },
            REFRESH_SECRET,
            { expiresIn: "20d" }
          );
          res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "Lax",
            maxAge: 20 * 24 * 60 * 60 * 1000,
          });
          stored.ip = ip;
          stored.token = refresh_token;
          stored.lastUsed = Date.now();
          stored.expiresAt = Date.now() + 20 * 24 * 60 * 60 * 1000;
          await stored.save();
        }
      }

      // Generate a new access token
      const access_token = jwt.sign(
        {
          id: decodedRefresh.id,
          username: decodedRefresh.username,
          role: decodedRefresh.role,
        },
        ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      // Set new access token cookie
      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
      });

      req.user = decodedRefresh;
      //  Use the passed-in options
      if (options?.requireAdmin && req.user.role !== "Admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      next();
    } catch (err) {
      // console.error("Refresh verification failed:", err);
      ClearCookies(res);
      return res.status(401).json({ message: "Invalid session" });
    }
  };
};
