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
const { getSummary } = require("../controller/learn/classification/getSummary");

const { Auth } = require("../middleware/Auth");

router.get("/", Auth, getallClassification);
router.get("/:id", getClassification);
router.get("/sidebar/:id", getSummary);
router.post("/create", createClassification);
router.delete("/delete/:id", deleteClassification);
router.patch("/update/:id", updateClassification);

module.exports = router;
