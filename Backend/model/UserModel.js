const mongoose = require("mongoose");
const UserDetailSchema = require("../schema/UserDetailSchema");
// Detailed user schema
const UserModel = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    userRole: { type: String, default: "User", enum: ["User", "Admin"] },
    userDetails: { UserDetailSchema },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", UserModel);

module.exports = { User };
