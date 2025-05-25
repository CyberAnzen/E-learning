const ProductModel = require("../model/ProductModel")

exports.updateProduct = async (req,res,next) =>{
    const data = req.body
    try{
        const oldData = await ProductModel.findById(req.params.id);
        const newdata = await ProductModel.findByIdAndUpdate(
            req.params.id,
            {...oldData.toObject() ,...req.body},
            { new: true } 

        );
        res.status(200).json({ message: "Product updated", newdata});
    } catch (err) {
        res.status(500).json({ message: "Error updating product", error: err.message });
    }
};