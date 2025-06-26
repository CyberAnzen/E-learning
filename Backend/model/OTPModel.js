const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    regNumber: { type:String, required: true},
    officialEmail:{type:String, required: true},
    otp: { type: Number, required: true },
    email: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users" },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // 5 minutes
});

const OTP = mongoose.model("otps", otpSchema);

module.exports = OTP;
