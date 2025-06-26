const mongoose = require("mongoose");

// Detailed user schema
const detailedUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userDetails: {
    name: { type: String, required: true },
    dept: { type: String, required: true },
    section: { type: String, required: true },
    phoneNo: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    regNumber: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    officialEmail: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    regDate: { type: String, required: true }
  }
});
const DetailedUser = mongoose.model("Users", detailedUserSchema);


module.exports = {  DetailedUser };
