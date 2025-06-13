const { Event } = require('../../model/EventModel');
const path = require('path');
const fs = require('fs');

const cacheManager = require('../../cache/cacheManager');

exports.createEvent = async (req, res) => {
    try {
            const {eventName, time, date, description, venue , eventOrganizerName, eventOrganizerEmail} = req.body;
            const image=req.file.filename;
            const event = {
                eventName,
                eventImage: image,
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
            
            // Call the function to create JSON file after event creation
/*             const jsonStatus = await EventJsonFile();
            if (jsonStatus.status === 'success') {
                console.log(jsonStatus.message);
                res.status(201).json({
                    success: true,
                    message: 'Event created successfully & JSON file updated',
                });
            } else {
                console.error(jsonStatus.message, jsonStatus.error);
                res.status(207).json({
                success: null,
                message: "Event created, but failed to update local JSON file",
                });

            } */

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });

    // You can access deletedEvent.event_image or other fields here
    try {
        fs.unlinkSync(path.join(process.cwd(), 'uploads', 'events', 'images', req.file.filename));
        console.log('Old event image deleted successfully');
    } catch (error) {
        console.error('Error deleting old event image:', error.message);
    }

    }
}
