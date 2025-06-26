const express = require("express");
const router = express.Router();
const {
  answerValidation,
} = require("../controller/learn/question/answerValidation");
const {
  answerSubmission,
} = require("../controller/learn/question/answerSubmission");
router.post("/submit", answerSubmission);
router.post("/validate", answerValidation);
module.exports = router;
