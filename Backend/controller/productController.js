const ProductModel = require('../model/ProductModel')

exports.getProducts = async(req,res,next)=>{
    const products = await ProductModel.find({})
    res.json(
        {   "message": "Data fetched successfully"
           
        }
    )
}