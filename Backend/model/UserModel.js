const mongoose = require("mongoose");

// Detailed user schema
const detailedUserSchema = new mongoose.Schema({
  user_name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user_details: {
    name: { type: String, required: true },
    dept: { type: String, required: true },
    section: { type: String, required: true },
    phone_no: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    reg_no: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    official_email: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    reg_date: { type: String, required: true }
  }
});
const DetailedUser = mongoose.model("Users", detailedUserSchema);


module.exports = {  DetailedUser };
