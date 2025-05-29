const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventById, UpdateEvent, deleteEvent ,updateEventImage,bannerEvent} = require('../controller/EventController');
const { verify: auth } = require("../middleware/verify");
const fileUploader = require('../utilies/FileUploder');
const upload = fileUploader('uploads/events/images');

//banner event route
router.get('/bannerEvents',bannerEvent)

router.post('/create', upload.single('event_image'), createEvent);
router.get('/', getEvents);
router.put('/update/image/:id', upload.single('event_image'), updateEventImage);
router.put('/update/:id',upload.none(), UpdateEvent);
router.delete('/delete/:id', deleteEvent);
router.get('/:id', getEventById);


module.exports = router;