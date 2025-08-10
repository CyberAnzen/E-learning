
const {User}=require('../../../../model/UserModel')
const customError=require('../../../../utilies/customError')



const updateLink = async (req, res) => {
    var userLink=[]
    try { 
        const userId = req.user.id; // Assuming user ID is stored in req.user
        if (!userId) {
            throw new customError('User ID is required', 400, {}, `User ID is required`);
        }
        console.log(req.body);
        
        const {linkedin, github, portfolio} = req.body; // Destructure to get the links
        const userData = await User.findById(userId);
        if (!userData) {
            throw new customError('User not found', 404, { userId }, `User with ID ${userId} not found`);
        }

        const validateLinkedIn = (url) =>
             /^https:\/\/(www\.)?linkedin\.com\/.*$/.test(url);
        const validateGitHub = (url) =>
              /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(url);
        const validateURL = (url) =>
                /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(url); // Generic for portfolio

        if (linkedin && !validateLinkedIn(linkedin)) {
            throw new customError('Invalid LinkedIn link', 400, { }, `Invalid LinkedIn link`);
        }
        else if(linkedin && validateLinkedIn(linkedin)){
           // console.log("linkedin",req.body.linkedin);
            
            userLink.push({name:"linkedin",link:req.body.linkedin})
        }
        if (github && !validateGitHub(github)) {
            throw new customError('Invalid GitHub link', 400, { }, `Invalid GitHub link`);
        }
        else if(github && validateGitHub(github)){
            userLink.push({name:"github",link:req.body.github}) 
        }
        if (portfolio && !validateURL(portfolio)) {
            throw new customError('Invalid Portfolio link', 400, { }, `Invalid Portfolio link`);
        }   
        else if(portfolio && validateURL(portfolio)){
            userLink.push({name:"portfolio",link:req.body.portfolio})
        }


            const response = await User.findByIdAndUpdate(userId, { "profile.socialLinks":userLink }, { new: true });
            const existingLinksMap = {};
            (response.profile.socialLinks || []).forEach(link => {
                existingLinksMap[link.name] = link.link;
            });
        if (!response) { 
            throw new customError('Failed to update links', 500, {}, `Failed to update links for user ID ${userId}`);
        }
        return  res.status(200).json({
            success: true,
            message: 'Link updated successfully',
            data: existingLinksMap,
        });
    } catch (error) {
        if (error instanceof customError) {
            console.error(`[updateLink] [Custom Error]:`, error.error);
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        console.error(`[updateLink] [Error]:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = updateLink;



// Example usage
//const user = users.find(u => u.name === 'Charlie');
//console.log(user); 