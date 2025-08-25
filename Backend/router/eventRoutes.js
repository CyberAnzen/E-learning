const express = require("express");
const router = express.Router();
const fileUploader = require("../utilies/FileUploder");
const upload = fileUploader("temp/events/");
const eventManager = require("../controller/manager/eventManager");
const { Auth } = require("../middleware/Auth");
const xssSanitizer = require("../middleware/xssSanitizer");


//banner event route
router.get("/",
  xssSanitizer(),
   eventManager.getEvents);

router.get("/bannerEvents", 
  xssSanitizer(),
  eventManager.bannerEvent);

//Strictly Admin Protected Routes
router.post(
  "/create",
 // Auth({ requireAdmin: true }),
 upload.single("eventImage"),
 xssSanitizer(),
 eventManager.createEvent
);
router.put(
  "/update/image/:id",
  Auth({ requireAdmin: true }),
  upload.single("eventImage"),
  xssSanitizer(),
  eventManager.updateEventImage
);
router.put(
  "/update/:id",
  Auth({ requireAdmin: true }),
  upload.none(),
  xssSanitizer(),
  eventManager.updateEvent
);
router.delete(
  "/delete/:id",
  Auth({ requireAdmin: true }),
  xssSanitizer(),
  eventManager.deleteEvent
);
router.get("/:id",
  Auth({ requireAdmin: true }),
  xssSanitizer(),
 eventManager.getEventById
);

module.exports = router;
