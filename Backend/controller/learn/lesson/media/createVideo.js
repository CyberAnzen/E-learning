const fs = require('fs');
const path = require('path');
const {moveFile}=require('../../../../utilies/fileUtilies')


const createVideos = async (req, res) => {
    let videos=req.file.filename;
    const filePath = "temp/uploads/videos/" ; // Assuming the temp folder is where the file is uploaded
    let outputPath="public/learn/videos" 
    try {
        if(!videos){
            return res.status(400).json({
                success: false,
                message: "Error in uploding videos_1" 
            })
        }
        const moved = await moveFile(videos, filePath, outputPath);
        if (!moved.success) {
            return res.status(400).json({ 
                success: false,
                message: "Error moving video file",
                error: moved.error 
            });
        }
        return res.status(200).json({ 
            success: true,
            message: "Video created successfully", 
            video: videos,
            videoPath: path.join("learn","videos", videos)
        });


    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
}
module.exports=createVideos;