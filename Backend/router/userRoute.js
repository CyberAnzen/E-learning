const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

// Importing the user controllers
const {signup}=require("../controller/user/Signup")
const {login}=require("../controller/user/Login")
const {checkusername}=require("../controller/user/CheckUsername")
const {PasswordReset}=require("../controller/user/PasswordReset")

// Importing the OTP controllers
const {OtpGenerator}=require("../controller/otp/OtpGenerator")
const {OtpVerification}=require("../controller/otp/OtpVerification")

// Rate limiter for signup: Limit to 5 attempts per hour
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many signup attempts from this IP, please try again after 1 hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for login: Limit to 10 attempts per hour
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many login attempts from this IP, please try again after 1 hour",
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
  message: "Too many email requests from this IP, please try again after 1 hour",
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
router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);
router.get("/check-username", checkUsernameLimiter, checkusername);
//router.post("/send-email", emailLimiter, SMTP);
router.post("/forgot-password", otpGeneratorLimiter, OtpGenerator);
router.post("/verify-otp", otpVerifyLimiter, OtpVerification);
router.post("/reset-password", passwordResetLimiter, PasswordReset);

module.exports = router;
