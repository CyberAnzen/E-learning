const express = require("express");
const router = express.Router();
const { Auth } = require("../middleware/Auth");
/* const fileUploader = require('../utilies/FileUploder')
const upload = fileUploader("temp/uploads/images", 
    { allowedTypes: ['image/jpeg', 'image/png', 'image/webp'], 
    maxSize: 5 * 1024 * 1024 }
) */


const getProfile  = require("../controller/user/profile/getProfile");
const updateLink = require("../controller/user/profile/links/updateLink");
const updateSkill = require("../controller/user/profile/skills/updateSkill");
const updateUserDetails= require("../controller/user/profile/updateUserDetails");
//const createAvator = require("../controller/user/profile/avator/createAvator");
const checkRegNo=require("../controller/user/profile/checkRegNo")



router.get("/data",Auth(), getProfile);
router.post("/links", Auth(),updateLink); 
router.post("/skills", Auth(), updateSkill);
router.post("/update", updateUserDetails);
/* router.post("/avator/create", 
    upload.single("image"), 
    createAvator
); */
router.get("/checkRegNo",Auth(), checkRegNo);



module.exports = router;
