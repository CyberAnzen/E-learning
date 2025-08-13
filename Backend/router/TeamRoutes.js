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
const {
  generateInvite,
} = require("../controller/CTF/Challenges/User/Team/generateInvite");
router.post("/createTeam", Auth(), createTeam);
router.patch("/updateMembers", Auth(), updateMembers);
router.delete("/deleteTeam", Auth(), deleteTeam);
router.get("/generateInvite", Auth(), generateInvite);
router.post(
  "/revokeInvite",
  Auth(),
  require("../controller/CTF/Challenges/User/Team/revokeInvite").revokeInvite
);
router.post(
  "/acceptInvite",
  Auth(),
  require("../controller/CTF/Challenges/User/Team/acceptInvite").acceptInvite
);
module.exports = router;
