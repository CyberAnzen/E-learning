const {User} = require('../../../model/UserModel'); // Adjust the path as necessary

const getProfile = async (req, res) => {
  try {
    const userId = req.body.id; // Assuming user ID is stored in req.user
    if (!userId) {
      console.error('[getProfile] [error] User ID is required');
        return res.status(400).json({
            success: false,
            message: 'User ID is required' });
    }
    const userProfile = await User.findById(userId).select('-password -__v -createdAt -updatedAt -userRole'); // Exclude sensitive fields

    if (!userProfile) {
        console.error(`[getProfile] [error] User with ID ${userId} not found`);
        return res.status(404).json({ message: 'User not found' });
    }

    

    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: userProfile,
    });

  } catch (error) {
    console.error('[getProfile] [error] Error fetching user profile:', error);
    res.status(500).json({ 
        success: false,
        message: 'Internal server error' });
  }
}

module.exports = getProfile ;