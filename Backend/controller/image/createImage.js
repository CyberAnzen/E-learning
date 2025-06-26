const {listAllFiles,renameFile}=require('../../utilies/fileUtilies')
const {convertToWebP}=require('../../utilies/webpCovertor')
const fs= require('fs')
const path =require('path')
const createImage = (folderName) => async (req, res) => {
    let image=req.file.filename;
    const filePath = "temp/uploads/images/" ; // Assuming the temp folder is where the file is uploaded
    let outputPath=""  // Assuming the output path in public
    const order=parseInt(req.body?.order)
    try {
        if (!folderName || folderName.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "No path provided in the request body"
        });
        }
        outputPath=path.join("public", folderName.toString().trim().toLowerCase());
        if (!fs.existsSync(path.join(process.cwd(), outputPath))) {
            fs.mkdirSync(path.join(process.cwd(), outputPath), { recursive: true });
        }
        const fileName= await listAllFiles(outputPath);
        console.log("file length",fileName.files.length);
        
        if (!fileName.success){
            return res.status(400).json({ 
                success:false,
                message: "error in finding the files" });
        }
        
        const result = await convertToWebP(image, filePath, outputPath,);
        if (!result.success) {
            return res.status(400).json({ 
                success:false,
                message: "Error converting image to WebP format",
                error: result.error });
        }
        else if (fileName.files.length === 0 && result.success) {
            
            image= result.convertedImages;
            const renamed= await renameFile(outputPath,image,"1.webp");
            if (!renamed.success) {
                return res.status(400).json({ 
                    success:false,
                    message: "Error renaming the file", 
                    error: renamed.error });
            }
            return res.status(200).json({ 
                success:true,
                message: "Image created successfully", image});
        }

        else{
            if (fileName.files.length>0 &&result.success){
                if(order<= fileName.files.length){
                    for(let n=fileName.files.length;n>=order;n--){
                        const oldFileName = fileName.files[n-1];
                        const newFileName = `${n+1}.webp`;
                        const renamed= await renameFile(outputPath,oldFileName,newFileName);
                        if (!renamed.success) {
                            return res.status(400).json({ 
                                success:false,
                                message: "Error renaming the file in order__1", error: renamed.error });
                        }
                    }
                    image= result.convertedImages;
                    const renamed= await renameFile(outputPath,image,`${order}.webp`);
                    if (!renamed.success) {
                        return res.status(400).json({ 
                            success:false,
                            message: "Error renaming the file in order__2", error: renamed.error });
                    }
                    return res.status(200).json({ 
                        success:true,
                        message: "Image created successfully", image });
                }
                else if(order==fileName.files.length+1){
                    image= result.convertedImages;
                    const renamed= await renameFile(outputPath,image,`${order}.webp`);
                    if (!renamed.success) {
                        return res.status(400).json({ 
                            success:false,
                            message: "Error renaming the file at the end", error: renamed.error });
                    }
                    return res.status(200).json({ 
                        success:true,
                        message: "Image created successfully" });

                }
               else{
                    try {
                        fs.unlinkSync(path.join(process.cwd(),outputPath,result.convertedImages));
                        return res.status(400).json({ 
                            message: `${order} is invalid number only ${fileName.length} is present`,
                            success:false });
                    } catch (error) {
                        console.error("Error deleting file:", error);
                        return res.status(500).json({
                            success:false,
                            message: "Internal server error" });
                        
                    }
                } 
            }
        }
    } catch (error) {
        console.error("Error creating image:", error);
        try {
            console.error("Unexpected error:", error);
            console.error("Image to delete:", image);
            if (fs.existsSync(path.join(process.cwd(), filePath, image))){
                fs.unlinkSync(path.join(process.cwd(), filePath, image));
                console.log("Deleted the image:", image);

            }
            else if (fs.existsSync(path.join(process.cwd(), outputPath, image))){
                fs.unlinkSync(path.join(process.cwd(), outputPath, image));
                console.log("Deleted the image:", image);
            }
            return res.status(500).json({ 
                success:false,
                message: "error in creating the homw image and deleted the uploaded image" });
        } catch (error) {
            console.error("Error deleting file after the error:", error);
            return res.status(500).json({ 
                success:false,
                message: "Internal server error and uploaded file is not deleted" });
            
        }
}
}

module.exports= createImage