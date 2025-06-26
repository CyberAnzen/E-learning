const { Event } = require('../../model/EventModel');

const cacheManager = require('../../cache/cacheManager');

exports.updateEvent = async (req, res) => {
    try {
       // log('UpdateEvent called with body:', req.body);
        const { id } = req.params;
        const {
            eventName,
            time,
            date,
            description,
            venue,
            eventOrganizerName,
            eventOrganizerEmail
        } = req.body;

        // Initialize the update object with $set
        const update = { $set: {} };

        // Update top-level field
        if (eventName) update.$set['eventName'] = eventName;

        // Update individual nested fields using dot notation
        if (time) update.$set['eventDetails.time'] = time;
        if (date) update.$set['eventDetails.date'] = date;
        if (description) update.$set['eventDetails.description'] = description;
        if (venue) update.$set['eventDetails.venue'] = venue;
        if (eventOrganizerName) update.$set['eventDetails.organizerName'] = eventOrganizerName;
        if (eventOrganizerEmail) update.$set['eventDetails.organizerEmail'] = eventOrganizerEmail;

        // If nothing to update, return early
        if (Object.keys(update.$set).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for update'
            });
        }
        //log('Update object:', update);
        // Perform the update
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            update,
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
         // Call the function to create JSON file after event deletion
        const cacheStatus = await cacheManager.refreshCache('eventCache');
        if (cacheStatus.success) {
            console.log('Cache refreshed successfully after event updated');
            res.status(200).json({
                success: true,
                message: 'Event updated successfully and cache refreshed'
            });
        } else {
            console.error('Cache refresh failed:', cacheStatus.message);
            res.status(cacheStatus.statusCode).json({
                success: false,
                message: 'Event updated, but cache refresh failed'
            });
        }


    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
};
