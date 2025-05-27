const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    event_name: { type: String, required: true },
    event_image: { type: String, required: true },
    event_details: {
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    organizer_name: { type: String, required: true },
    organizer_email: { type: String, required: true }
  }
},{ timestamps: true });

const Event = mongoose.model('Events', eventSchema);
module.exports = { Event };