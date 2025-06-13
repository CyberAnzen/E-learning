const express = require("express");
const router = express.Router();
const {
  answerValidation,
} = require("../controller/learn/question/answerValidation");
router.post("/validate", answerValidation);
module.exports = router;
