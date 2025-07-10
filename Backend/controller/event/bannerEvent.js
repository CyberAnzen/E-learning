const cacheManager = require('../../cache/cacheManager');
//const { Event } = require('../model/EventModel');
exports.bannerEvent = async (req, res) => {
 
    try {


        const cacheData = cacheManager.getCache('eventCache');
       // console.log(cacheData);
       if (!cacheData || !Array.isArray(cacheData.data)) {
             return res.status(404).json({
                success: false,
                message: 'No banner events found'
            });
        }

        const bannerEvents = cacheData.data.filter(event => event);

        if (bannerEvents.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No banner events found'
            });
        }

        res.status(200).json({
            success: true,
            data: bannerEvents
        });

    } catch (error) {
        console.error("Error fetching banner event",error);
        
        res.status(500).json({
            success: false,
            message: 'Error fetching banner event',
            error: error.message
        }); 
    }
}