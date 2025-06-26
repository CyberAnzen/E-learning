const { Event } = require('../../model/EventModel');
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ updatedAt: -1 });
        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
}