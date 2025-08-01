const customError=require('../../../../utilies/customError')
const cacheManager = require('../../../../cache/cacheManager');

const getAllDefaultAvator = async (req, res) => {
    try {
        const cacheData = cacheManager.getCache('defaultAvatorCache');
        if (!cacheData || !Array.isArray(cacheData.data)) {
            throw new customError('No default avatars found', 404, {}, 'No default avatars found in cache');
        }
        let defaultAvators = cacheData.data;

        if (defaultAvators.length === 0) {
            throw new customError('No default avatars available', 404, {}, 'No default avatars available in cache');
        }

        defaultAvators = defaultAvators.map(avator => ({
            name: avator.name,
            path: avator.path+ avator.name,
            gender: avator.gender
        }));

        
        res.status(200).json({
            success: true,
            message: 'Default avatars fetched successfully',
            data: defaultAvators
        });
    } catch (error) {
        if (error instanceof customError) {
            console.error('[getAllDefaultAvator] [customError] Error in getAllDefaultAvator:', error.message);
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: error.data
            });
        }
        console.error('[getAllDefaultAvator] [Error] Error in getAllDefaultAvator:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch default avatars',
            error: error.message || 'Unknown error'
        });
    }
}

module.exports = getAllDefaultAvator;