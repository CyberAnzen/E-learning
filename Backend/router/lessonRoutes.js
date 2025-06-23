const express = require("express");
const router = express.Router();
const { createLesson } = require("../controller/learn/lesson/createLesson");
const { getLesson } = require("../controller/learn/lesson/getLesson");
const { deleteLesson } = require("../controller/learn/lesson/deleteLesson");
const { updateLesson } = require("../controller/learn/lesson/updateLesson");

router.get("/:ClassificationId/:LessonId", getLesson);
router.post("/create", createLesson);
router.delete("/delete/:id", deleteLesson);
router.patch("/update", updateLesson);
module.exports = router;
