const mongoose = require("mongoose");
const currentYear = new Date().getFullYear() % 100;

// Detailed user schema
const UserModel = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userRole: { type: String, default: "User", enum: ["User", "Admin"] },
    phoneNo: {
        type: Number,
        required: true,
        unique: true,
        validate: {
          validator: function (v) {
            return /^[6-9]\d{9}$/.test(v.toString());
          },
          message: "Phone number must be a valid 10-digit Indian mobile number",
        },
      },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    regNumber: {
        type: String,
        required: true,
        unique: true,
        set: (v) => v.toUpperCase(),
        match: /^RA\d{2}\d{9,11}$/,
        validate: {
          validator: function (v) {
            const yearPart = parseInt(v.slice(2, 4), 10);
            return yearPart <= currentYear;
          },
          message: `Admission year in regNumber cannot be in the future.`,
        },
      },
    officialEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    userDetails: {
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        set: (v) => v.trim().replace(/\s+/g, " "),
      },
      dept: {
        type: String,
        required: true,
        trim: true,
        enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AI", "DS"],
      },
      section: {
        type: String,
        required: true,
        match: /^[A-Z]$/,
      },
      
      gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
      },
      year: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
    profile: {
      socialLinks: {
        type:Array,
        default: [],
        validate: {
          validator: function (v) {
            return v.every(
              (link) => typeof link === "string" && link.startsWith("http")
            );
          },
          message: "All social links must be valid URLs",
        },
    },
    skills:{
      type: Array,
      default: [],
      validate: {
        validator: function (v) {
          return v.every((skill) => typeof skill === "string" && skill.length > 0);
        },
        message: "All skills must be non-empty strings",
      },
    }
  },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", UserModel);

module.exports = { User };
