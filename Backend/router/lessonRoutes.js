const express = require("express");
const router = express.Router();
const { createLesson } = require("../controller/learn/lesson/createLesson");
const { getLesson } = require("../controller/learn/lesson/getLesson");
const { deleteLesson } = require("../controller/learn/lesson/deleteLesson");
const { updateLesson } = require("../controller/learn/lesson/updateLesson");
const createImage = require("../controller/learn/lesson/media/createImage");
const createVideos = require("../controller/learn/lesson/media/createVideo");
const { singleFileUpload } = require("../middleware/dynamicFileUploadPath");
const { Auth } = require("../middleware/Auth");

router.post(
  "/createImage",
  singleFileUpload("temp/uploads/images/", "image"),
  createImage
);
router.post(
  "/createVideo",
  singleFileUpload("temp/uploads/videos/", "video"),
  createVideos
);

router.get("/:ClassificationId/:LessonId", Auth(), getLesson);
router.post("/create", createLesson);
router.delete("/delete/:id", deleteLesson);
router.patch("/update", updateLesson);
module.exports = router;
