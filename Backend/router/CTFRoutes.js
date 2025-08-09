const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { Auth } = require("../middleware/Auth");
const xssSanitizer = require("../middleware/xssSanitizer");
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

//Admin Routes
router.get("/admin/:ChallengeId", Auth(), getChallengeAdmin);
router.post("/admin/create", upload.none(), CreateChallenges);
router.patch("/admin/update/:ChallengeId", upload.none(), updateChallenge);
router.delete("/admin/delete/:ChallengeId", deleteChallenge);

//User
router.get("/", getallChallenge);
router.get("/:ChallengeId", Auth(), getChallenge);
module.exports = router;
