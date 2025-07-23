const express = require("express");
const router = express.Router();
const { Auth } = require("../middleware/Auth");
const getProfile  = require("../controller/user/profile/getProfile");
const updateLink = require("../controller/user/profile/links/updateLink");
const updateSkill = require("../controller/user/profile/skills/updateSkill");

router.get("/data",Auth(), getProfile);
router.post("/links", Auth(),updateLink); 
router.post("/skills", Auth(), updateSkill);



module.exports = router;
