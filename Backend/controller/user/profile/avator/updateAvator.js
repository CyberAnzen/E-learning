const {User}=require('../../../../model/UserModel')
const customError=require('../../../../utilies/customError')
const cacheManager = require('../../../../cache/cacheManager');


const updateAvator = async (req,res)=>{
    try {

        const userId =req.user.id
        if(!userId){
            throw new customError('User ID is required', 400, { userId },`User ID is required`)
        }
        const userData = User.findById(userId);
        if (!userData) {
            throw new customError('User not found', 404, { userId },`User with ID ${userId} not found`);
        }
        const image =req.body.image
        if(!image){
            throw new customError('Image is required', 400, {},`Image is required`);
        }
        const normalizedImage = image.trim()
                
        const cacheData = cacheManager.getCache('defaultAvatorCache')

        if (!cacheData || !Array.isArray(cacheData.data)) {
            throw new customError('No default avatars found', 404, {}, 'No default avatars found in cache');
        }
        const defaultAvators = cacheData.data;
       if (!defaultAvators.some(avatar => avatar.name.toLowerCase() === image.toLowerCase())) {
            throw new customError('Invalid avatar image', 400, { image }, `Avatar image ${image} is not a valid default avatar`);
        }
        
        const response = await User.findByIdAndUpdate(userId,{
            "profile.avator": "/avator/default/"+image
        }
        , { new: true });
        if (!response) {
            throw new customError('Failed to update avatar', 500, { userId }, 'Failed to update user avatar');
        }
        res.status(200).json({
            success: true,
            message: 'Avatar updated successfully',
            data: {
                userId: response._id,
                avator: response.profile.avator
            }
        });

    } catch (error) {
        if (error instanceof customError) {
            console.error('[updateAvator] [customError] Error in updateAvator:', error.message);
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: error.data
            });
        }
        console.error('[updateAvator] [Error] Error in updateAvator:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}


module.exports=updateAvator