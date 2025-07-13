const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { Auth } = require("../middleware/Auth");
// Importing the user controllers
const userManager = require("../controller/manager/userManager");
const { TimeStamp } = require("../middleware/TimeStamp");
// Importing the OTP controllers
const OtpManager = require("../controller/manager/OtpManager");
const xssSanitizer = require("../middleware/xssSanitizer");


// Rate limiter for signup: Limit to 5 attempts per hour
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message:
    "Too many signup attempts from this IP, please try again after 1 hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for login: Limit to 10 attempts per hour
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message:
    "Too many login attempts from this IP, please try again after 1 hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for username checking: Limit to 50 per hour
const checkUsernameLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: "Too many username check requests, please try again after 1 hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for sending email: Limit to 10 attempts per hour
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message:
    "Too many email requests from this IP, please try again after 1 hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for OTP generation (forgot password): Limit to 5 attempts per hour
const otpGeneratorLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many forgot password attempts, please try again after 1 hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for OTP verification: Limit to 10 attempts per hour
const otpVerifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many OTP verification attempts, please try again after 1 hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for password reset: Limit to 5 attempts per hour
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many password reset attempts, please try again after 1 hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes with applied rate limiters
router.post("/signup", 
  TimeStamp(2), 
  signupLimiter, 
  xssSanitizer(),
  userManager.signup
);

router.post("/login", 
  TimeStamp(2), 
  loginLimiter, 
  xssSanitizer(),
  userManager.login
);

router.post("/logout", 
  TimeStamp, 
  xssSanitizer(),
  userManager.logout);
router.get(
  "/check-username",
  TimeStamp(2),
  checkUsernameLimiter,
  xssSanitizer(),
  userManager.checkusername
);
//router.post("/send-email", emailLimiter, SMTP);
router.post(
  "/forgot-password",
  TimeStamp(2),
  otpGeneratorLimiter,
  xssSanitizer(),
  OtpManager.OtpGenerator
);
router.post(
  "/verify-otp",
  TimeStamp(2),
  otpVerifyLimiter,
  xssSanitizer(),
  OtpManager.OtpVerification
);
router.post(
  "/reset-password",
  TimeStamp(2),
  passwordResetLimiter,
  xssSanitizer(),
  userManager.PasswordReset
);
module.exports = router;
