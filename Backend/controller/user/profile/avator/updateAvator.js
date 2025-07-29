const {User}=require('../../../../model/UserModel')
const customError=require('../../../../utilies/customError')

const convertToWebP = require('../../../../utilies/convertToWebP')


const updateAvator = async (req,res)=>{
    try {
        const userId =req.body.id
        if(!userId){
            throw new customError('User ID is required', 400, { userId },`User ID is required`)
        }
        const userData = User.findById(userId);
        if (!userData) {
            throw new customError('User not found', 404, { userId },`User with ID ${userId} not found`);
        }

    } catch (error) {
        
    }
}


module.exports=updateAvator