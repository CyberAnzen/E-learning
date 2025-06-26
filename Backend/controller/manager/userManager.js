
const {checkusername} = require("../user/checkusername");
const {PasswordReset} = require("../user/PasswordReset");
const { login } = require("../user/login");
const {signup}= require("../user/Signup");

const userManager = {
    checkusername,
    PasswordReset,
    login,
    signup
};

module.exports = userManager;