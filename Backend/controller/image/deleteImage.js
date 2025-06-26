const fs = require("fs");
const path = require("path");
const {listAllFiles,renameFile}=require('../../utilies/fileUtilies')
const customError = require("../../utilies/customError");
//const { convertToWebP } = require("../../utilies/webpCovertor");

const deleteImage = async (req, res) => {
    const filePath = "temp/uploads/images/" ; // Assuming the temp folder is where the file is uploaded
    let outputPath=""  // Assuming the output path in public
    const order=parseInt(req.body?.order)
    try {
        console.log("path",req.body.path);
        console.log("order",order);
        if (!req.body.path) {
        return res.status(400).json({
            success: false,
            message: "No path provided in the request body"
        });
        }
        outputPath=path.join("public", req.body.path.toString().trim().toLowerCase());
        if (!fs.existsSync(path.join(process.cwd(), outputPath))) {
            throw new customError("Output path does not exist", 404);
        }
        const fileName= await listAllFiles(outputPath);
        console.log("file length",fileName.files.length);
        if (!fileName.success){
            throw new customError("Error in finding the files", 400, { type: 1 }, fileName.error);
        }
        if (order < 1 || order > fileName.files.length) {
            throw new customError("Invalid order specified", 400, { type: 1 });
        }
        if (order > 0 && order <= fileName.files.length) {
            try {
                const fileToDelete = path.join(process.cwd(), outputPath, `${order}.webp`);
                if (fs.existsSync(fileToDelete)) {
                    fs.unlinkSync(fileToDelete);
                } 
            } catch (error) {
                throw new customError("Error deleting the image", 500, error);
            }
            // Renaming files after deletion
            for (let n = order + 1; n <= fileName.files.length; n++) {
                const oldFileName = `${n}.webp`;
                const newFileName = `${n - 1}.webp`;
                const renamed = await renameFile(outputPath, oldFileName, newFileName);
                if (!renamed.success) {
                    throw new customError("Error renaming the file", 400, { type: 1 }, renamed.error);
                }
            }
            return res.status(200).json({ 
                success: true, 
                message: "Image deleted successfully" });
        } else {
            throw new customError("Order is not valid", 400, { type: 1 });
        }

    } catch (error) {
        if (error instanceof customError) {
            return res.status(error.statusCode).json({ 
                success: false, 
                message: error.message, 
                error: error.error });
        }
        else{
            return res.status(500).json({ 
                success: false, 
                message: "Internal server error", 
                error: error.message });
        }
    }
}


module.exports = deleteImage;