
const { OtpGenerator } = require("../otp/OtpGenerator");
const {OtpVerification}= require("../otp/OtpVerification");

const OtpManager = {
    OtpGenerator,
    OtpVerification
};

module.exports = OtpManager;