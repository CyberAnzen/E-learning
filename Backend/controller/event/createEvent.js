const { Event } = require('../../model/EventModel');
const path = require('path');
const fs = require('fs');
const { convertToWebP } = require('../../utilies/webpCovertor');
const dataCache=require('../../cache/structure/dataCache')
const fetchLatestEvents=require('../../cache/fetchers/fetchLatestEvent')
const cacheManager = require('../../cache/cacheManager');

/* function normalizeImagePaths(images) {
  return images.map((url) => {
    const match = url.match(/(\/events\/.+)$/);
    return match ? match[1] : url;
  });
} */

exports.createEvent = async (req, res) => {
    try {
            const {eventName, time, date, description, venue , eventOrganizerName, eventOrganizerEmail} = req.body;
            const image=req.file.filename;
            const filePath = "temp/events/" ; // Assuming the temp folder is where the file is uploaded
            const outputPath ="public/events/images"
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
                    imagePath: "/events/images/"+ image.replace(/\.[^/.]+$/, ".webp"),
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
                console.log('Event created');
    
                let cacheStatus = await cacheManager.refreshCache('eventCache');
                //console.log("cacheststus",cacheStatus);
                
                if (cacheStatus.success) {
                    console.log('Cache refreshed successfully and event created:');
                    res.status(200).json({
                        success: true,
                        message: 'Event created successfully and cache refreshed'
                    });
                } else if(!cacheStatus.success && cacheStatus.statusCode===404){
                    cacheStatus=await cacheManager.registerCache('eventCache',dataCache,fetchLatestEvents)
                     if (cacheStatus.success) {
                        console.log('new eventCache create successfully and event created:');
                        res.status(201).json({
                            success: true,
                            message: 'Event created successfully and cache refreshed'
                        });
                    }
                    else{
                         console.error('Cache refresh failed:', cacheStatus.message);
                    res.status(cacheStatus.statusCode).json({
                        success: false,
                        message: 'Event created, but cache refresh failed',
                        error: cacheStatus.error
                    });
                    }
                }
                else {
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
