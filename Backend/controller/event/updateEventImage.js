const path = require('path');
const fs = require('fs');
const { Event } = require('../../model/EventModel');
const cacheManager = require('../../cache/cacheManager');

exports.updateEventImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = req.file.filename;
        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }
        const event = await Event.findById(id);
        const updatedEvent = await Event.findByIdAndUpdate(id, {
            eventImage: image
        }, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        try {
            fs.unlinkSync(path.join(process.cwd(), 'uploads', 'events', 'images', event.event_image));
        } catch (error) {
            console.error('Error deleting old event image:', error.message);
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

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating event image',
            error: error.message
        });
    }
}