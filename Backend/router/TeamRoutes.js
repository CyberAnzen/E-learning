const express = require("express");
const router = express.Router();
const { Auth } = require("../middleware/Auth");
const {
  createTeam,
} = require("../controller/CTF/Challenges/User/Team/Leader/createTeam");
const {
  updateMembers,
} = require("../controller/CTF/Challenges/User/Team/Leader/updateMembers");
const {
  deleteTeam,
} = require("../controller/CTF/Challenges/User/Team/Leader/deleteTeam");
const {
  generateInvite,
} = require("../controller/CTF/Challenges/User/Team/Leader/generateInvite");

router.get(
  "/",
  Auth(),
  require("../controller/CTF/Challenges/User/Team/getteamDetails")
    .getTeamDetails
);
router.post("/createTeam", Auth(), createTeam);
// router.patch("/updateMembers", Auth(), updateMembers);
router.delete("/deleteTeam", Auth(), deleteTeam);
router.post("/generateInvite", Auth(), generateInvite);
router.post(
  "/revokeInvite",
  Auth(),
  require("../controller/CTF/Challenges/User/Team/Leader/revokeInvite")
    .revokeInvite
);
router.post(
  "/acceptInvite",
  Auth(),
  require("../controller/CTF/Challenges/User/Team/Members/acceptInvite")
    .acceptInvite
);
router.patch(
  "/updateTeam",
  Auth(),
  require("../controller/CTF/Challenges/User/Team/Leader/updateTeam").updateTeam
);
router.put(
  "/changeLeader",
  Auth(),
  require("../controller/CTF/Challenges/User/Team/Leader/changeLeader")
    .changeLeader
);
router.post(
  "/leaveTeam",
  Auth(),
  require("../controller/CTF/Challenges/User/Team/leaveTeam").leaveTeam
);
router.delete(
  "/removeMember",
  Auth(),
  require("../controller/CTF/Challenges/User/Team/Leader/removeMember")
    .removeMember
);
module.exports = router;
