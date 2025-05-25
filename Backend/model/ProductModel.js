const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema(
    {
        name:String,
        about:String,
        image:String
    }

)

const ProductModel = mongoose.model('Products',ProductSchema)

module.exports = ProductModel