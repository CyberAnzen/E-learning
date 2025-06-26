const fs = require('fs');
const path = require('path');
const {moveFile}=require('../../../../utilies/fileUtilies')
const customError = require('../../../../utilies/customError');


const createVideos = async (req, res) => {
    let videos="";
    const filePath = "temp/uploads/videos/" ; // Assuming the temp folder is where the file is uploaded
    let outputPath="public/learn/videos" 
    try {
        videos=req.file.filename;
        if(!videos){
            throw new customError("Error in uploading video", 400,{ type: 1 });
        }
        const moved = await moveFile(videos, filePath, outputPath);
        if (!moved.success) {
            throw new customError("Error moving video file", 400, {videos,type:2}, moved.error);
        }
        return res.status(200).json({ 
            success: true,
            message: "Video created successfully", 
            video: videos,
            videoPath:  "learn/videos/"+videos
        });


    } catch (error) {
          if(fs.existsSync(path.join(process.cwd(),filePath, videos))) {
            fs.unlinkSync(path.join(process.cwd(),filePath, videos));
        }
        else if (fs.existsSync(path.join(process.cwd(), outputPath, videos))) {
            fs.unlinkSync(path.join(process.cwd(), outputPath, videos));
        }
        if (error instanceof customError) {
            console.error(`[processing error]=>[type:${error.data.type}]Error in createVideos:`, error.message, error.error);

            return res.status(error.statusCode).json({ 
                success: false, 
                message: error.message 
            });
        }
        console.error("[Internal server error]=>Error in createVideos:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}
module.exports=createVideos;