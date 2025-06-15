const express = require("express");
const router = express.Router();
const {
  answerSubmission,
} = require("../controller/learn/question/answerSubmission");
router.post("/submit", answerSubmission);
module.exports = router;
