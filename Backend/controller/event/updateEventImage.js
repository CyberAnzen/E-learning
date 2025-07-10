const path = require('path');
const fs = require('fs');
const { Event } = require('../../model/EventModel');
const cacheManager = require('../../cache/cacheManager');
const { convertToWebP } = require('../../utilies/webpCovertor');

exports.updateEventImage = async (req, res) => {
    const tempimage= req.file.filename;
    let  oldImage = '';
    let errorStage ;
    try {
        const { id } = req.params;
        let image = req.file.filename;
        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }
        const event = await Event.findById(id);

        if (!event) {
           fs.unlinkSync(path.join(process.cwd(), 'public', 'events', 'temp', image));
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });


        }
        const filePath = "temp/events/"; // Assuming the temp folder is where the file is uploaded
        const outputPath = "public/events/images";
        const conversionResult = await convertToWebP(image, filePath, outputPath);

        if (!conversionResult.success) {
            console.error('Image conversion failed:', conversionResult.message);
            fs.unlinkSync(path.join(process.cwd(), 'temp', 'events', image));
            return res.status(500).json({
                success: false,
                imageFailure: true,
                message: 'Image conversion failed',
                error: conversionResult.error
            });
        }
        else if (conversionResult.success) {
            image = image.replace(/\.[^/.]+$/, ".webp");
            const imagePath = "/events/images/"+image;
             const updatedEvent = await Event.findByIdAndUpdate(id, {
                eventImage: image,
                imagePath: imagePath
            }, { new: true });
            
            try {
                fs.unlinkSync(path.join(process.cwd(), 'public', 'events', 'images', event.eventImage));

            } catch (error) {
                oldImage = event.eventImage;
                console.error('Error deleting old event image:', error.message);
                errorStage=1;
            }
    
            const cacheStatus = await cacheManager.refreshCache('eventCache');
            if (cacheStatus.success) {
                console.log('Cache refreshed successfully after event updated image');
                res.status(200).json({
                    success: true,
                    message: 'Event updated image successfully and cache refreshed'
                });
            } else {
                console.error('Cache refresh failed:', cacheStatus.message);
                res.status(cacheStatus.statusCode).json({
                    success: false,
                    message: 'Event updated image, but cache refresh failed'
                });
            }
        }

    } catch (error) {
        console.error('Error updating event image:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error updating event image',
            error: error.message
        });
        if (fs.existsSync(path.join(process.cwd(), 'temp', 'events', tempimage))) {
        fs.unlinkSync(path.join(process.cwd(), 'temp', 'events', tempimage));
        console.log('Temporary file deleted successfully');
        } 
        else if (errorStage === 1) {
             try {
        fs.unlinkSync(path.join(process.cwd(), 'public', 'events', 'images', oldImage));
        console.log('Old image deleted after failure');
        } catch (err) {
            console.error('Failed to delete old image after failure:', err.message);
        }
        }
        else {
        console.log('Temporary file does not exist, no deletion needed');
        }
    }
}