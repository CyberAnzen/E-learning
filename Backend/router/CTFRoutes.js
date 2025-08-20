const express = require("express");
const router = express.Router();
const {dynamicFileUpload}= require("../middleware//dynamicFileUploadPath");
const randomPathName = require("../middleware/randomPathName");
const updateRandomPath = require("../middleware/updateRandomPath");
const fileUploader = require("../utilies/FileUploder");
const upload = fileUploader("public/CTF/Challenges/");
const { Auth } = require("../middleware/Auth");
const xssSanitizer = require("../middleware/xssSanitizer");
const Path = require("path");


//controllers
const {
  CreateChallenges,
} = require("../controller/CTF/Challenges/Admin/CreateChallenges");
const {
  getChallengeAdmin,
} = require("../controller/CTF/Challenges/Admin/getChallengeAdmin");
const {
  updateChallenge,
} = require("../controller/CTF/Challenges/Admin/updateChallenge");
const {
  getallChallenge,
} = require("../controller/CTF/Challenges/User/getallChallenge");
const {
  getChallenge,
} = require("../controller/CTF/Challenges/User/getChallenge");
const {
  deleteChallenge,
} = require("../controller/CTF/Challenges/Admin/deleteChallenge");
const { getHint } = require("../controller/CTF/Challenges/User/getHints");

//Admin Routes
router.get("/admin/:ChallengeId", Auth(), getChallengeAdmin);
router.post("/admin/create",
   dynamicFileUpload({
    type: "multi",
    tempPath: Path.join("temp","CTF_Challenges"),
    para: "attachments",
    maxCount: 10,
    randomFileName: false,
    randomPathName: true,
}),
    randomPathName(Path.join("public","CTF","Challenges"), "title"),
   CreateChallenges);
   
router.patch("/admin/update/:ChallengeId", 
  dynamicFileUpload({
    type: "multi",
    tempPath: Path.join("temp","CTF_Challenges"),
    para: "attachments",
    maxCount: 10,
    randomFileName: false,
    randomPathName: true,
}),
    updateRandomPath(Path.join("public","CTF","Challenges"),"existingAttachments", "title")  ,
     updateChallenge);
router.delete("/admin/delete/:ChallengeId", deleteChallenge);

//User
router.get("/", getallChallenge);
router.get("/:ChallengeId", Auth(), getChallenge);
router.get("/:ChallengeId/hint/:hintId", Auth(), getHint);
router.post(
  "/:ChallengeId/validateFlag",
  Auth(),
  require("../controller/CTF/Challenges/User/validateFlag").validateFlag
);
module.exports = router;
