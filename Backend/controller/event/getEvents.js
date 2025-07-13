const { Event } = require('../../model/EventModel');
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ updatedAt: -1 });
        if (!events || events.length === 0) {
            return res.status(404).json({success: false, message: 'No events found'});
        }
        const formattedEvents = events.map(event => {
            const plainEvent = event.toObject();
            delete plainEvent.createdAt;
            delete plainEvent.updatedAt;
            delete plainEvent.__v;
            return plainEvent;
        });

        res.status(200).json({
            success: true,
            data: formattedEvents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
}