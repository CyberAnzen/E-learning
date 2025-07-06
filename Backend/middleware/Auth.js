const jwt = require("jsonwebtoken");
const RefreshToken = require("../model/RefreshTokenModel");
const INACTIVITY_WINDOW = 30 * 60 * 1000; // e.g. 30 minutes
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ClearCookies = async (res) => {
  // Clear the token cookie
  res.cookie("access_token", "", {
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "none",
  });

  // Clear the rememberMe cookie
  res.cookie("refresh_token", "", {
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "none",
  });
};
exports.Auth = async (req, res, next) => {
  const accessToken = req.cookies?.access_token;
  const refreshToken = req.cookies?.refresh_token;
  const fp = req.headers["x-client-fp"]; // Send fingerprint from frontend
  const ua = req.headers["user-agent"];
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  //CASE:Auth Middleware for authorisation
  try {
    if (accessToken) {
      // Try to verify access token
      const decoded = jwt.verify(accessToken, ACCESS_SECRET);
      req.user = decoded;
      return next();
    }
  } catch (err) {
    // Only continue if token is expired (otherwise it's a bad token)
    if (err.name !== "TokenExpiredError") {
      ClearCookies(res);
      return res.status(403).json({ message: "Invalid access token" });
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
    if (!refreshToken || !fp || !accessToken) {
      ClearCookies(res);
      if (stored) await stored.deleteOne();

      return res.status(401).json({ message: "Not authorized" });
    }

    if (stored.fp !== fp || stored.ua !== ua) {
      if (stored) await stored.deleteOne();
      ClearCookies(res);
      return res.status(403).json({ message: "Session invalidated" });
    }
    if (stored.expiresAt < Date.now()) {
      await stored.deleteOne();
      ClearCookies(res);
      return res.status(403).json({ message: "Refresh token expired" });
    }

    if (!stored.rememberMe) {
      stored.lastUsed = Date.now();
      stored.expiresAt = Date.now() + INACTIVITY_WINDOW;
      await stored.save();
    }
    if (stored.rememberMe) {
      const remainingTime = stored.expiresAt - Date.now();
      if (remainingTime < 7 * 24 * 60 * 60 * 1000) {
        // Less than 7 days left → extend by 20 days
        stored.expiresAt = Date.now() + 20 * 24 * 60 * 60 * 1000;
        await stored.save();
      }
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      {
        id: decodedRefresh.id,
        username: decodedRefresh.username,
        role: decodedRefresh.role,
      },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // Set new access token cookie
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
    });

    req.user = decodedRefresh;
    next();
  } catch (err) {
    // console.error("Refresh verification failed:", err);
    ClearCookies(res);
    return res.status(403).json({ message: "Invalid session" });
  }
};
