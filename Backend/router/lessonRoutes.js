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

router.get("/:ClassificationId/:LessonId", Auth(), getLesson);

//Strictly Admin Protected Routes
router.post(
  "/createImage",
  Auth({ requireAdmin: true }),
  singleFileUpload("temp/uploads/images/", "image"),
  createImage
);
router.post(
  "/createVideo",
  Auth({ requireAdmin: true }),
  singleFileUpload("temp/uploads/videos/", "video"),
  createVideos
);

router.post("/create", Auth({ requireAdmin: true }), createLesson);
router.delete("/delete/:id", Auth({ requireAdmin: true }), deleteLesson);
router.patch("/update", Auth({ requireAdmin: true }), updateLesson);
module.exports = router;
