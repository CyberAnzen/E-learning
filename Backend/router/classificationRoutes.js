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
  _getallClassification,
} = require("../controller/learn/classification/_getallClassification");
const {
  updateClassification,
} = require("../controller/learn/classification/updateClassification");
const { getSummary } = require("../controller/learn/classification/getSummary");

const { Auth } = require("../middleware/Auth");

router.get("/guest", _getallClassification);
//Protected Routes

router.get("/", Auth(), getallClassification);
router.get("/:id", Auth(), getClassification);
router.get("/sidebar/:id", Auth(), getSummary);
//Strictly Admin Protected Routes

router.post("/create", Auth({ requireAdmin: true }), createClassification);
router.delete(
  "/delete/:id",
  Auth({ requireAdmin: true }),
  deleteClassification
);
router.patch("/update/:id", Auth({ requireAdmin: true }), updateClassification);

module.exports = router;
