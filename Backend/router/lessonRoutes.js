const express = require("express");
const router = express.Router();
const { createLesson } = require("../controller/learn/lesson/createLesson");
const { getLesson } = require("../controller/learn/lesson/getLesson");
const { deleteLesson } = require("../controller/learn/lesson/deleteLesson");
const { updateLesson } = require("../controller/learn/lesson/updateLesson");
const createImage = require("../controller/learn/lesson/media/createImage");
const {singleFileUpload}=require('../middleware/dynamicFileUploadPath')

router.post("/createImage",singleFileUpload("temp/uploads/images/","image"), createImage);

router.get("/:ClassificationId/:LessonId", getLesson);
router.post("/create", createLesson);
router.delete("/delete/:id", deleteLesson);
router.patch("/update", updateLesson);
module.exports = router;
