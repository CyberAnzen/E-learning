const {Event} = require('../../model/EventModel');
const customError = require('../../utilies/customError')

const fetchLatestEvents = async () => {
  try {
    const events=await Event.find({}).sort({ updatedAt: -1 }).limit(3);
    if (!events || events.length === 0) {
      throw new customError("No events found", 404);
    }
    return {
      data:events,
      success:true
    }
  } catch (error) {
     console.error("[cacheManager => fetcher]Failed to fetch latest events for caching:", error.error || error.message);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch events",
      error: error.message || "Unknown error"
    };
  }
};

module.exports = fetchLatestEvents;
