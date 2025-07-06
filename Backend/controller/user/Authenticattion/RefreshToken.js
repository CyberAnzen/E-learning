const jwt = require("jsonwebtoken");
const RefreshToken = require("../../../model/RefreshTokenModel");

exports.refresh = async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.sendStatus(401);

  let data;
  try {
    data = jwt.verify(token, process.env.REFRESH_SECRET);
  } catch {
    return res.sendStatus(403);
  }

  // lookup stored refresh token
  const stored = await RefreshToken.findOne({ token });
  if (!stored) return res.sendStatus(403);

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  const ua = req.headers["user-agent"];
  const fp = req.body.fp || req.headers["x-fp"];

  // verify metadata
  if (stored.ua !== ua || stored.fp !== fp) {
    await stored.deleteOne();
    return res.sendStatus(403);
  }

  // issue new access token
  const { id, username, role } = data;
  const newAccess = jwt.sign(
    { id, username, role, ip, ua },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );

  res.cookie("access_token", newAccess, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });
  res.json({ access_token: newAccess });
};
