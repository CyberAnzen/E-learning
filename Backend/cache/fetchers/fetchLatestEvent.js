const {Event} = require('../../model/EventModel');

const fetchLatestEvents = async () => {
  return await Event.find({}).sort({ updatedAt: -1 }).limit(3);
};

module.exports = fetchLatestEvents;
