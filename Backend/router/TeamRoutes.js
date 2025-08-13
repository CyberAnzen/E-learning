const express = require("express");
const router = express.Router();
const { Auth } = require("../middleware/Auth");
const {
  createTeam,
} = require("../controller/CTF/Challenges/User/Team/createTeam");
const {
  updateMembers,
} = require("../controller/CTF/Challenges/User/Team/updateMembers");
const {
  deleteTeam,
} = require("../controller/CTF/Challenges/User/Team/deleteTeam");
router.post("/createTeam", Auth(), createTeam);
router.patch("/updateMembers", Auth(), updateMembers);
router.delete("/deleteTeam", Auth(), deleteTeam);
module.exports = router;
