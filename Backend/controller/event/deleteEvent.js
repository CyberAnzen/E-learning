const path = require('path');
const fs = require('fs');
const { Event } = require('../../model/EventModel');
const cacheManager = require('../../cache/cacheManager');
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

       // Delete the event image file
       if (deletedEvent) {
           // You can access deletedEvent.event_image or other fields here
           try {
               fs.unlinkSync(path.join(process.cwd(), 'public', 'events', 'images', deletedEvent.eventImage));
            } catch (error) {
                console.error('Error deleting old event image:', error.message);
            }
        }
        // Refresh the cache after deleting the event
        const cacheStatus = await cacheManager.refreshCache('eventCache');
        if (cacheStatus.success) {
            console.log('Cache refreshed successfully after event deletion');
          return  res.status(200).json({
                success: true,
                message: 'Event deleted successfully and cache refreshed'
            });
        } else {
            console.error('Cache refresh failed:', cacheStatus.message);
           return res.status(cacheStatus.statusCode).json({
                success: false,
                message: 'Event deleted, but cache refresh failed'
            });
        }
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message
        });
    }
}
