const { checkusername } = require("../user/Authenticattion/checkusername");
const { PasswordReset } = require("../user/Authenticattion/PasswordReset");
const { login } = require("../user/Authenticattion/login");
const { signup } = require("../user/Authenticattion/Signup");
const { logout } = require("../user/Authenticattion/logout");
const { refresh } = require("../user/Authenticattion/RefreshToken");

const userManager = {
  checkusername,
  PasswordReset,
  login,
  signup,
  logout,
  refresh,
};

module.exports = userManager;
