const express = require("express");
const router = express.Router();
const {
  answerValidation,
} = require("../controller/learn/question/answerValidation");
const {
  answerSubmission,
} = require("../controller/learn/question/answerSubmission");
const { Auth } = require("../middleware/Auth");
const xssSanitizer = require("../middleware/xssSanitizer");

router.post("/validate",
  xssSanitizer(),
  Auth(), answerValidation);
router.post("/submit", 
  xssSanitizer(),
  Auth(), answerSubmission);

module.exports = router;
