const express = require("express");
const router = express.Router();
const fileUploader = require("../utilies/FileUploder");
const upload = fileUploader("temp/events/");
const eventManager = require("../controller/manager/eventManager");
const { Auth } = require("../middleware/Auth");

//banner event route
router.get("/", eventManager.getEvents);

router.get("/bannerEvents", eventManager.bannerEvent);

//Strictly Admin Protected Routes
router.post(
  "/create",
  Auth({ requireAdmin: true }),
  upload.single("eventImage"),
  eventManager.createEvent
);
router.put(
  "/update/image/:id",
  Auth({ requireAdmin: true }),
  upload.single("eventImage"),
  eventManager.updateEventImage
);
router.put(
  "/update/:id",
  Auth({ requireAdmin: true }),
  upload.none(),
  eventManager.updateEvent
);
router.delete(
  "/delete/:id",
  Auth({ requireAdmin: true }),
  eventManager.deleteEvent
);
router.get("/:id", Auth({ requireAdmin: true }), eventManager.getEventById);

module.exports = router;
