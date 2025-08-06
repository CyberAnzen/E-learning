const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { Auth } = require("../middleware/Auth");
const xssSanitizer = require("../middleware/xssSanitizer");
//controllers
const {
  CreateChallenges,
} = require("../controller/CTF/Challenges/CreateChallenges");
const {
  getChallengeAdmin,
} = require("../controller/CTF/Challenges/getChallengeAdmin");
const {
  updateChallenge,
} = require("../controller/CTF/Challenges/updateChallenge");
router.get("/admin/:ChallengeId", Auth(), getChallengeAdmin);
router.post("/admin/create", upload.none(), CreateChallenges);
router.post("/admin/update/:ChallengeId", upload.none(), updateChallenge);

module.exports = router;
