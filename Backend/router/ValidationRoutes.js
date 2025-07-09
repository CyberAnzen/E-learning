const express = require("express");
const router = express.Router();
const {
  answerValidation,
} = require("../controller/learn/question/answerValidation");
const {
  answerSubmission,
} = require("../controller/learn/question/answerSubmission");
const { Auth } = require("../middleware/Auth");

router.post("/validate", Auth(), answerValidation);
router.post("/submit", Auth(), answerSubmission);

module.exports = router;
