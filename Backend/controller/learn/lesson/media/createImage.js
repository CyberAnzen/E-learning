const fs = require('fs');
const path = require('path');
const {convertToWebP}=require('../../../../utilies/webpCovertor');
const customError = require('../../../../utilies/customError');


const createImage = async (req, res) => {
    let image = "";
    const filePath = "temp/uploads/images/" ; // Assuming the temp folder is where the file is uploaded
    let outputPath="public/learn/images" 
    try {
        image=req.file.filename;
        if(!image){
            throw new customError("Error in uploading image", 400,{ type: 1 });
        }
        const converted = await convertToWebP(image, filePath, outputPath);
        if (!converted.success) {
            console.error("Error converting image to WebP format:", converted.error);
            throw new customError("Error converting image to WebP format", 400, {image,type:2}, converted.error);
        }
        image = converted.convertedImages;
        return res.status(200).json({ 
            success: true,
            message: "Image created successfully", 
            image,
            imagePath: "learn/images/"+image
        });

    } catch (error) {
        
        if(fs.existsSync(path.join(process.cwd(),filePath, image))) {
            fs.unlinkSync(path.join(process.cwd(),filePath, image));
        }
        else if (fs.existsSync(path.join(process.cwd(), outputPath, image))) {
            fs.unlinkSync(path.join(process.cwd(), outputPath, image));
        }
        if (error instanceof customError) {
            console.error(`[processing error]=>[type:${error.data.type}]Error in createImage:`, error.message, error.error);

            return res.status(error.statusCode).json({ 
                success: false, 
                message: error.messager 
            });
        }
        console.error("[Internal server error]=>Error in createImage:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports=createImage;