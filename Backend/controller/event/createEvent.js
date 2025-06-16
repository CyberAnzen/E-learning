const { Event } = require('../../model/EventModel');
const path = require('path');
const fs = require('fs');
const { convertToWebP } = require('../../utilies/webpCovertor');

const cacheManager = require('../../cache/cacheManager');

exports.createEvent = async (req, res) => {
    try {
            const {eventName, time, date, description, venue , eventOrganizerName, eventOrganizerEmail} = req.body;
            const image=req.file.filename;
            const filePath = "uploads/events/temp/" ; // Assuming the temp folder is where the file is uploaded
            const outputPath ="uploads/events/images"
            const conversionResult = await convertToWebP(image ,filePath,outputPath);
            if (!conversionResult.success) {
                console.error('Image conversion failed:', conversionResult.message);
                return res.status(500).json({
                    success: false,
                    imageFailure: true,
                    message: 'Image conversion failed',
                    error: conversionResult.error
                });
            }
            else if( conversionResult.success){
                const event = {
                    eventName,
                    eventImage: image.replace(/\.[^/.]+$/, ".webp"),
                    imagePath: path.join(outputPath, image.replace(/\.[^/.]+$/, ".webp")),
                    eventDetails: {
                        description,
                        date,
                        time,
                        venue,
                        organizerName: eventOrganizerName,
                        organizerEmail: eventOrganizerEmail
                    }
                };
    
                const newEvent = await Event.create(event);
                console.log('Event created:', newEvent);
    
                const cacheStatus = await cacheManager.refreshCache('eventCache');
                if (cacheStatus.success) {
                    console.log('Cache refreshed successfully and event created:');
                    res.status(201).json({
                        success: true,
                        message: 'Event created successfully and cache refreshed',
                        data: newEvent
                    });
                } else {
                    console.error('Cache refresh failed:', cacheStatus.message);
                    res.status(cacheStatus.statusCode).json({
                        success: false,
                        message: 'Event created, but cache refresh failed',
                        error: cacheStatus.error
                    });
                }

            }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });

    // You can access deletedEvent.event_image or other fields here
    try {
        const oldname= req.file.filename.replace(/\.[^/.]+$/, ".webp");
        fs.unlinkSync(path.join(process.cwd(), 'uploads', 'events', 'images', oldname));
        console.log('Old event image deleted successfully');
    } catch (error) {
        console.error('Error deleting old event image:', error.message);
    }

    }
}
