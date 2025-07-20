const {User}=require('../../../../model/UserModel')
const customError=require('../../../../utils/customError')
const createAvator=(userId)=>{
    try {
        if(!userId) {
            throw new customError('User ID is required', 400, { userId },`User ID is required`);
        }
        const userData = user.findById(userId);
        if (!userData) {
            throw new customError('User not found', 404, { userId },`User with ID ${userId} not found`);
        }
        if (!userData.avatar) {
            
        }

    } catch (error) {
        if (error instanceof customError) {
            console.error(`[createAvator] [Custom Error]:`, error.error);
            return {
                success: false,
                message: error.message,
                statusCode: error.statusCode,
                }
        }
    }
} 