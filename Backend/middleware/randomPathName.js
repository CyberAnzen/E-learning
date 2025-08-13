const crypto = require('crypto');
const moveFile = require('../utilies/files/moveFile'); // adjust path as needed
const Path = require('path');


function randomPathName(path,payload) {
    return async (req, res, next) => {
        try {
            const random24 = crypto.randomBytes(18)
                .toString('base64')
                .replace(/[^a-z0-9]/gi, '')
                .substring(0, 24);
            const data = req.body?.[payload];
            if (!data) {
                console.error('[randomPathName] payload is required to create a random path name.');
                return res.status(400).json({
                    success: false,
                    message: 'Title is required to create a random path name.'
                });
            }

            // Create a random path using the title and random string
            // Ensure the title is sanitized to avoid issues with file paths
            const sanitizedData = data.replace(/[^a-z0-9]/gi, '').toLowerCase(); 
            const randomPath = Path.join(path,`${random24}-${sanitizedData}`)
            const tempPath =req.customFileUpload.tempPath;

            for (const element of req.files) {
                await moveFile(
                            element.filename,
                            tempPath,
                            randomPath
                        );
            
            }

            req.customFileUpload.randomPathName = randomPath;
            next();
        } catch (error) {
            console.error('[randomPathName] Error during file moving:', error);
           return res.status(500).json({
                success: false,
                message: 'An error occurred while setting up file moving file.',
                error: error.message
            });// Pass error to Express error handler
        }
    };
}

module.exports = randomPathName;