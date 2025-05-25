const ProductModel = require('../model/ProductModel')


exports.uploadProducts = async (req,res,next) => {
    const {name, about, image} = req.body
    try{
        const product = await ProductModel.create({name, about, image})
       res.json({
            message: "Product created successfully",
            product
       })
    }
    catch(err){
        res.json({
            message: err.message 
        })
    }
    
    
}