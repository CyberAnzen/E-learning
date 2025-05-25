const express = require('express');
const router = express.Router();
const { verify: auth } = require("../middleware/verify");
const { getProducts } = require('../controller/productController');
const { uploadProducts } = require('../controller/uploadController');
const { updateProduct } = require('../controller/updateController');
const { deleteController } = require('../controller/deleteController');

router.route('/product').get(getProducts);
router.route("/product/upload").post(auth, uploadProducts);
router.put("/product/update/:id", auth, updateProduct);
router.delete("/product/delete/:id", auth, deleteController);

module.exports = router;
