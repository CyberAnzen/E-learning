// middleware/verifyTurnstile.js
const https = require("https");
const { URLSearchParams } = require("url");

async function verifyTurnstileToken(token, remoteIp) {
  if (!process.env.CF_SECRET_KEY) {
    throw new Error("CF_SECRET_KEY missing in server env");
  }

  const postData = new URLSearchParams({
    secret: process.env.CF_SECRET_KEY,
    response: token,
    remoteip: remoteIp || "",
  }).toString();

  const options = {
    hostname: "challenges.cloudflare.com",
    path: "/turnstile/v0/siteverify",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(raw || "{}");
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

// Express middleware to require a valid captcha
async function requireTurnstile(req, res, next) {
  try {
    const token =
      req.body?.captcha ||
      req.body?.["cf-turnstile-response"] ||
      req.headers["cf-turnstile-response"];

    if (!token) {
      return res.status(400).json({ message: "Captcha token required" });
    }

    const data = await verifyTurnstileToken(token, req.ip);
    if (data && data.success) {
      req.turnstile = data;
      return next();
    } else {
      return res
        .status(403)
        .json({ message: "Captcha verification failed", details: data });
    }
  } catch (err) {
    console.error("Turnstile verify error:", err);
    return res.status(500).json({ message: "Captcha verification error" });
  }
}

module.exports = { verifyTurnstileToken, requireTurnstile };
