const express = require("express");
const router = express.Router();

const getProfile  = require("../controller/user/profile/getProfile");

router.get("/data", getProfile);


module.exports = router;
