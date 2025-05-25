const ProductModel = require('../model/ProductModel')

exports.deleteController = async(req, res, next)=>{
    try{
        const deleteData= await ProductModel.findByIdAndDelete(req.params.id)
        if(!deleteData) return res.status(403).json({ message: "Product Not deleted", deleteData})

        res.status(200).json({ message: "Product deleted", deleteData})

    }
    catch(error){

            res.status(500).json({ message: "Error deleting product", error: err.message });

    }

}