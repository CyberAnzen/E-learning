const { checkusername } = require("../user/Authenticattion/checkusername");
const { PasswordReset } = require("../user/Authenticattion/PasswordReset");
const { login } = require("../user/Authenticattion/login");
const { signup } = require("../user/Authenticattion/Signup");

const userManager = {
  checkusername,
  PasswordReset,
  login,
  signup,
};

module.exports = userManager;
