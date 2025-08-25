const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventImage: { type: String, required: true },
    imagePath: { type: String, required: true },
    updatedBy: { type: String },
    eventDetails: {
        description: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        venue: { type: String, required: true },
        organizerName: { type: String, required: true },
        organizerEmail: { type: String, required: true }
  }
},{ timestamps: true });

const Event = mongoose.model('Events', eventSchema);
module.exports = { Event };