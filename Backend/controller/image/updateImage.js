const fs = require("fs");
const path = require("path");
const {listAllFiles,renameFile}=require('../../utilies/fileUtilies')
const customError = require("../../utilies/customError");
const { convertToWebP } = require("../../utilies/webpCovertor");


const updateImage= async (req, res) => {
    let image=req.file.filename;
    const filePath = "temp/uploads/images/" ; // Assuming the temp folder is where the file is uploaded
    let outputPath=""  // Assuming the output path in public
    const order=parseInt(req.body?.order)
    try {
        if (!req.body.path) {
        return res.status(400).json({
            success: false,
            message: "No path provided in the request body"
        });
        }
        outputPath=path.join("public", req.body.path.toString().trim().toLowerCase());
        if (!fs.existsSync(path.join(process.cwd(), outputPath))) {
            fs.mkdirSync(path.join(process.cwd(), outputPath), { recursive: true });
        }
        const fileName= await listAllFiles(outputPath);
        console.log("file length",fileName.files.length);
        
        if (!fileName.success){
            throw new customError("error in finding the files", 400,{type:1},fileName.error);
        }

        if (order < 0 || order > fileName.files.length) {
            throw new customError("Invalid order specified", 400, { type: 1 });
        }
        if(order>0&&order<=fileName.files.length){
           // console.log("entering coversion");
            const convertedImage = await convertToWebP(image, filePath, outputPath);
           // console.log("convertedImage", convertedImage);
            if (!convertedImage.success) {
                throw new customError("Error converting image to webp", 400, { type: 2,deleteImage:image,filepath:filePath }, convertedImage.error);
            }
            image = convertedImage.convertedImages;
            try {
                if (fs.existsSync(path.join(process.cwd(), outputPath, `${order}.webp`))) {
                    fs.unlinkSync(path.join(process.cwd(), outputPath, `${order}.webp`));
                }
            } catch (error) {
                throw new customError("Error deleting the old image", 500, { type: 2,deleteImage:image,filePath:outputPath }, error);
            }
            const renamed= await renameFile(outputPath,image,`${order}.webp`);
            if (!renamed.success) {
                throw new customError("Error renaming the file", 400, { type: 1 }, renamed.error);
            }
            return res.status(200).json({ 
                success:true,
                message: "Image updated successfully", image: `${order}.webp` });
        }
        else{
           throw new customError("Order is not valid", 400, { type: 1 });
        }

        

    } catch (error) {
        console.error("Error in updating image:", error);
        if (error instanceof customError) {
            if (error.data.type === 1) {
                if (fs.existsSync(path.join(process.cwd(), filePath, image))){
                fs.unlinkSync(path.join(process.cwd(), filePath, image));
                console.log("Deleted the image:", image);

            }
                return res.status(error.statusCode).json({ 
                    success: false, 
                    message: error.message, 
                    error: error.error? error.error : null
                 });
            }
            else if (error.data.type === 2) {
                // Handle the case where the image conversion failed
                if (fs.existsSync(path.join(process.cwd(), error.data.filePath, error.data.deleteImage))) {
                  try {
                      fs.unlinkSync(path.join(process.cwd(), error.data.filePath, error.data.deleteImage));
                    
                      return res.status(error.statusCode).json({ 
                          success: false, 
                          message: error.message, 
                          error: error.error? error.error : null 
                      });
                  } catch (error) {
                        console.error("Error deleting the image:", error);
                         return res.status(error.statusCode).json({ 
                          success: false, 
                          message: error.message+ " and error deleting the image", 
                          error: error.error? error.error : null 
                      });
                  }
                }
            }
        }
        else{
            console.error("Unexpected error:", error);
            console.error("Image to delete:", image);
            if (fs.existsSync(path.join(process.cwd(), filePath, image))){
                fs.unlinkSync(path.join(process.cwd(), filePath, image));
                console.log("Deleted the image:", image);

            }
            return res.status(500).json({ 
                success: false, 
                message: "An unexpected error occurred", 
                error: error.message });
        }
        
    }
}

module.exports = updateImage;