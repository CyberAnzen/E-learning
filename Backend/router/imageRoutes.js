const express = require('express');
const router = express.Router();
const {singleFileUpload}=require('../middleware/dynamicFileUploadPath')
const createImage = require('../controller/image/createImage');
const updateImage = require('../controller/image/updateImage');
const deleteImage = require('../controller/image/deleteImage');


router.post('/create/about',singleFileUpload("/temp/uploads/images","image"), createImage("about"));
router.post('/create/home',singleFileUpload("/temp/uploads/images","image"), createImage("home"));

router.put('/update',singleFileUpload("/temp/uploads/images","image"), updateImage);
router.delete('/delete', deleteImage);


module.exports = router;