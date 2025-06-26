require('events').EventEmitter.defaultMaxListeners = 20; // Increase the default max listeners to avoid warnings


const {createEvent} = require('../event/createEvent');
const {getEvents} = require('../event/getEvents');
const { updateEvent } = require('../event/UpdateEvent');
const {deleteEvent} = require('../event/deleteEvent');
const {getEventById} = require('../event/getEventById');
const {bannerEvent} = require('../event/bannerEvent');
const {updateEventImage} = require('../event/updateEventImage');




const eventManager = {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent,
    getEventById,
    bannerEvent,
    updateEventImage
};

module.exports = eventManager;