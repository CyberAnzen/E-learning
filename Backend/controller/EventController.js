const path = require('path');
const fs = require('fs');
const { Event } = require('../model/EventModel');
const fileUploader = require('../utilies/FileUploder');
const { log } = require('console');
const { console } = require('inspector');

const upload = fileUploader('uploads/events/images');

async function EventJsonFile () {
    try {
        let data = await Event.find({}).sort({ updatedAt: -1 }).limit(3);
        const dir = path.join(process.cwd(), 'uploads', 'events', 'data');
        const filePath = path.join(dir, 'events.json');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('JSON file created successfully at:', filePath);
        let status = { status: 'success', message: 'JSON file created successfully' };
        return status;
    } catch (error) {
        let status = { status: 'error', message: 'Error creating JSON file', error: error.message };
        return status;
    }
}

exports.createEvent = async (req, res) => {
    try {
            const {event_name, time, date, description, venue , event_organizer_name, event_organizer_email} = req.body;
            const image=req.file.filename;
            const event = {
                event_name,
                event_image: image,
                event_details: {
                    description,
                    date,
                    time,
                    venue,
                    organizer_name: event_organizer_name,
                    organizer_email: event_organizer_email
                }
            };

            const newEvent = await Event.create(event);
            console.log('Event created:', newEvent.event_name);
            
            // Call the function to create JSON file after event creation
            const jsonStatus = await EventJsonFile();
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

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        } 
        res.status(200).json({
            success: true,
            data: event
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message
        });
    } }


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
            event_image: image
        }, { new: true });
        try {
            fs.unlinkSync(path.join(process.cwd(), 'uploads', 'events', 'images', event.event_image));
        } catch (error) {
            log.error('Error deleting old event image:', error.message);
        }
        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
       res.status(200).json({
            success: true,
            message: 'Event image updated successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating event image',
            error: error.message
        });
    }
}
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

        // Call the function to create JSON file after event deletion
        const jsonStatus = await EventJsonFile();
        if (jsonStatus.status === 'success') {
            console.log(jsonStatus.message);
            res.status(200).json({
                success: true,
                message: 'Event deleted successfully & JSON file updated',
            });
        } else {
            console.error(jsonStatus.message, jsonStatus.error);
            res.status(207).json({
                success: null,
                message: "Event deleted, but failed to update local JSON file",
            });
        }
        // Delete the event image file
        if (deletedEvent) {
            // You can access deletedEvent.event_image or other fields here
            try {
                fs.unlinkSync(path.join(process.cwd(), 'uploads', 'events', 'images', deletedEvent.event_image));
            } catch (error) {
                log.error('Error deleting old event image:', error.message);
            }
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message
        });
    }
}

exports.UpdateEvent = async (req, res) => {
    try {
       // log('UpdateEvent called with body:', req.body);
        const { id } = req.params;
        const {
            event_name,
            time,
            date,
            description,
            venue,
            event_organizer_name,
            event_organizer_email
        } = req.body;

        // Initialize the update object with $set
        const update = { $set: {} };

        // Update top-level field
        if (event_name) update.$set['event_name'] = event_name;

        // Update individual nested fields using dot notation
        if (time) update.$set['event_details.time'] = time;
        if (date) update.$set['event_details.date'] = date;
        if (description) update.$set['event_details.description'] = description;
        if (venue) update.$set['event_details.venue'] = venue;
        if (event_organizer_name) update.$set['event_details.organizer_name'] = event_organizer_name;
        if (event_organizer_email) update.$set['event_details.organizer_email'] = event_organizer_email;

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
        const jsonStatus = await EventJsonFile();
        if (jsonStatus.status === 'success') {
            console.log(jsonStatus.message);
            res.status(200).json({
                success: true,
                message: 'Event updated successfully & JSON file updated',
            });
        } else {
            console.error(jsonStatus.message, jsonStatus.error);
            res.status(207).json({
                success: null,
                message: "Event updated, but failed to update local JSON file",
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

exports.bannerEvent = async (req, res) => {
    const dir = path.join(process.cwd(), 'uploads', 'events', 'data');
    const filePath = path.join(dir, 'events.json');
    try {
        fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return res.status(500).json({
            success: false,
            message: 'Error reading JSON file',
            error: err.message
        });
    }
    try {
        const jsonData = JSON.parse(data);
        res.status(200).json(jsonData) // Now you can use the JSON data as a JS object/array
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).json({
            success: false,
            message: 'Error parsing JSON',
            error: parseError.message
        });
    }
});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching banner event',
            error: error.message
        }); 
    }
}