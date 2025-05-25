const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    reg_no: { type:String, required: true},
    official_email:{type:String, required: true},
    otp: { type: Number, required: true },
    email: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users" },
    user_name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // 5 minutes
});

const OTP = mongoose.model("otps", otpSchema);

module.exports = OTP;
