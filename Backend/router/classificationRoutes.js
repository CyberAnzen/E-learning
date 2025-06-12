const express = require("express");
const router = express.Router();
const {
  createClassification,
} = require("../controller/learn/classification/createClassification");
const {
  deleteClassification,
} = require("../controller/learn/classification/deleteClassification");
const {
  getClassification,
} = require("../controller/learn/classification/getClassification");
const {
  getallClassification,
} = require("../controller/learn/classification/getallClassification");
const {
  updateClassification,
} = require("../controller/learn/classification/updateClassification");
router.get("/", getallClassification);
router.get("/:id", getClassification);
router.post("/create", createClassification);
router.delete("/delete", deleteClassification);
router.patch("/update", updateClassification);
module.exports = router;
