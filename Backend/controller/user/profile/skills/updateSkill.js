
const {User}=require('../../../../model/UserModel')
const customError=require('../../../../utilies/customError')

const updateSkill = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user
        if (!userId) {
            throw new customError('User ID is required', 400, {}, `User ID is required`);
        }
        const { skills } = req.body; // Destructure to get the skills
        const userData = await User.findById(userId);
        if (!userData) {
            throw new customError('User not found', 404, { userId }, `User with ID ${userId} not found`);
        }

        if (!Array.isArray(skills)) {
            throw new customError('Skills must be a non-empty array', 400, {}, `Skills must be a non-empty array`);
        }

        const response = await User.findByIdAndUpdate(userId, { "profile.skills": skills }, { new: true });
        
        if (!response) { 
            throw new customError('Failed to update skills', 500, {}, `Failed to update skills for user ID ${userId}`);
        }
        
        return res.status(200).json({
            success: true,
            message: 'Skills updated successfully',
            data: response.profile.skills
        });
    } catch (error) {
        if (error instanceof customError) {
            console.error('[updateSkill] [customError] Error in updateSkill:', error.message);
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: error.data
            });
        }else {
            console.error('[updateSkill] [Error] Error in updateSkill:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }

    }
}

module.exports = updateSkill;