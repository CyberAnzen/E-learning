const {User} = require('../../../model/UserModel'); // Adjust the path as necessary
const customError = require('../../../utilies/customError');

const updateUserDetails = async (req, res) => {
    try {
        const userId = req.body.id; // Assuming user ID is stored in req.user
        if (!userId) {
            throw new customError('User ID is required', 400, {}, `User ID is required`);
        }
        const {  email,section, fullName,dept,regNumber,gender,year } = req.body; // Destructure to get the user details
        const userData = await User.findById(userId);
        if (!userData) {
            throw new customError('User not found', 404, { userId }, `User with ID ${userId} not found`);
        }
        if (!fullName || !email || !section || !dept || !regNumber || !year ||!gender) {
            throw new customError('All fields are required', 400, {}, `All fields are required`);
        }
        const updatedData = {};
        if (fullName) updatedData.name =fullName;
        if (email) updatedData.email = email;
        if (section) updatedData.section = section;
        if (dept) updatedData.dept = dept;
        if (regNumber) updatedData.regNumber = regNumber;
        if (year) updatedData.year = year;
        if (gender) updatedData.gender =gender;



        const response = await User.findByIdAndUpdate(userId,{
            email: updatedData.email,
            regNumber: updatedData.regNumber,
            "userDetails.name": updatedData.name,
            "userDetails.dept": updatedData.dept,
            "userDetails.section": updatedData.section,
            "userDetails.year": updatedData.year,
            "userDetails.gender": updatedData.gender
        }
            , { new: true });
        
        if (!response) {
            throw new customError('Failed to update user details', 500, {}, `Failed to update user details for user ID ${userId}`);
        }

        return res.status(200).json({
            success: true,
            message: 'User details updated successfully',
        });
    } catch (error) {
        if (error instanceof customError) {
            console.error('[updateUserDetails] [customError] Error in updateUserDetails:', error.message);
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: error.data
            });
        }
        else{
            console.error('[updateUserDetails] [Error] Error in updateUserDetails:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = updateUserDetails;