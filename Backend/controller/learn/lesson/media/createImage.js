const fs = require('fs');
const path = require('path');
const {convertToWebP}=require('../../../../utilies/webpCovertor');



const createImage = async (req, res) => {
    let image=req.file.filename;
    const filePath = "temp/uploads/images/" ; // Assuming the temp folder is where the file is uploaded
    let outputPath="public/learn/images" 
    try {
        const converted = await convertToWebP(image, filePath, outputPath);
        if (!converted.success) {
            return res.status(400).json({ 
                success: false,
                message: "Error converting image to WebP format",
                error: converted.error 
            });
        }
        image = converted.convertedImages;
        return res.status(200).json({ 
            success: true,
            message: "Image created successfully", 
            image,
            imagePath: path.join("learn","images", image)
        });

    } catch (error) {
        console.error("Error in createImage:", error);
        if(fs.existsSync(path.join(filePath, image))) {
            fs.unlinkSync(path.join(filePath, image));
        }
        return res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
}

module.exports=createImage;