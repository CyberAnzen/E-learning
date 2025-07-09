const express = require("express");
const router = express.Router();
const { singleFileUpload } = require("../middleware/dynamicFileUploadPath");
const createImage = require("../controller/image/createImage");
const updateImage = require("../controller/image/updateImage");
const deleteImage = require("../controller/image/deleteImage");
const { Auth } = require("../middleware/Auth");

router.post(
  "/create/about",
  Auth({ requireAdmin: true }),
  singleFileUpload("/temp/uploads/images", "image"),
  createImage("about")
);
router.post(
  "/create/home",
  Auth({ requireAdmin: true }),
  singleFileUpload("/temp/uploads/images", "image"),
  createImage("home")
);

router.put(
  "/update",
  Auth({ requireAdmin: true }),
  singleFileUpload("/temp/uploads/images", "image"),
  updateImage
);
router.delete("/delete", Auth({ requireAdmin: true }), deleteImage);

module.exports = router;
