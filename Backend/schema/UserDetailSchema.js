const mongoose = require("mongoose");
const currentYear = new Date().getFullYear() % 100; // gets '25' for 2025

const UserDetailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    set: (v) => v.trim().replace(/\s+/g, " "), // normalize spaces only
  },

  dept: {
    type: String,
    required: true,
    trim: true,
    enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AI", "DS"], // example
  },
  section: {
    type: String,
    required: true,
    match: /^[A-Z]$/, // single capital letter like A, B, C
  },
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
    set: (v) => v.toUpperCase(), // force uppercase storage
    match: /^RA\d{2}\d{9,11}$/, // uppercase 'RA' + 2-digit year + digits
    validate: {
      validator: function (v) {
        const yearPart = parseInt(v.slice(2, 4), 10);
        return yearPart <= currentYear;
      },
      message: `Admission year in regNumber cannot be in the future.`,
    },
  },

  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  officialEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  regDate: {
    type: String,
    required: true,
    match: /^\d{2}-\d{2}-\d{4}$/, // YYYY-MM-DD format
  },
});

module.exports = UserDetailSchema;
