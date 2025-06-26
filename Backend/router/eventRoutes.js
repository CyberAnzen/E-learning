const express = require('express');
const router = express.Router();
const { verify: auth } = require("../middleware/verify");
const fileUploader = require('../utilies/FileUploder');
const upload = fileUploader('uploads/events/temp');
const eventManager = require('../controller/manager/eventManager');

//banner event route
router.get('/bannerEvents',eventManager.bannerEvent)

router.post('/create', upload.single('eventImage'), eventManager.createEvent);
router.get('/', eventManager.getEvents);
router.put('/update/image/:id', upload.single('eventImage'), eventManager.updateEventImage);
router.put('/update/:id',upload.none(), eventManager.updateEvent);
router.delete('/delete/:id', eventManager.deleteEvent);
router.get('/:id', eventManager.getEventById);


module.exports = router;