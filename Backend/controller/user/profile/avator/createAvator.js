const {User}=require('../../../../model/UserModel')
const customError=require('../../../../utilies/customError')
const fs = require('fs');
const path = require('path');
const {convertToWebP} = require('../../../../utilies/webpCovertor')
const renameFile = require('../../../../utilies/files/renameFile');
const jsonPath = path.join( process.cwd(),'config/avatorNames.json');
const createAvator=async (req, res)=>{
    let image = "";
    const filePath = "temp/uploads/images/" ; // Assuming the temp folder is where the file is uploaded
    let outputPath="public/avator/default" 
    try {
        image=req.file.filename;
        if(!image){
            throw new customError("Error in uploading image", 400,{ type: 1 });
        }
        const gender = req.body.gender
        if(!gender){
            throw new customError("gender is required", 400, { type: 1 });  
        }
        const converted = await convertToWebP(image, filePath, outputPath);
        if (!converted.success) {
            console.error("Error converting image to WebP format:", converted.error);
            throw new customError("Error converting image to WebP format", 400, {image,type:2}, converted.error);
        }
        image = converted.convertedImages;
        const renamed= await renameFile(outputPath,image,image.slice(24));
        if (!renamed.success) {
            return res.status(400).json({ 
                success:false,
                message: "Error renaming the file in order__2", error: renamed.error });
        }


        const newEntry = {
            name: image.slice(24),
            gender,
            path:"/avator/default/"    
        }

                
        if (!fs.existsSync(jsonPath)) {
            fs.writeFileSync(jsonPath, '[]');
        }

        fs.readFile(jsonPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }

            let jsonData = [];

            try {
                jsonData = data.trim() ? JSON.parse(data) : [];
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                jsonData = [];
            }

            jsonData.push(newEntry);

            fs.writeFile(jsonPath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {
                    console.log('Data appended successfully!');
                }
            });
        });
        

        return res.status(200).json({ 
            success: true,
            message: "Image created successfully", 
            image
        });

    } catch (error) {
        
        if(fs.existsSync(path.join(process.cwd(),filePath, image))) {
            fs.unlinkSync(path.join(process.cwd(),filePath, image));
        }
        else if (fs.existsSync(path.join(process.cwd(), outputPath, image))) {
            fs.unlinkSync(path.join(process.cwd(), outputPath, image));
        }
        if (error instanceof customError) {
            console.error(`[createAvator] [processing error]=>[type:${error.data.type}]Error in createImage:`, error.message, error.error);

            return res.status(error.statusCode).json({ 
                success: false, 
                message: error.messager 
            });
        }
        console.error("[createAvator] [Internal server error]=>Error in createImage:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error"
        });
    }
} 


module.exports = createAvator;