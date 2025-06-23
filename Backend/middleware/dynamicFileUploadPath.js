const fileUpload = require('../utilies/FileUploder'); // adjust path as needed


// Reusable middleware generator
function singleFileUpload(defaultPath,para) {
    return (req, res, next) => {
        const filePath =defaultPath;
        
        const upload = fileUpload(filePath);

        upload.single(para)(req, res, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'File upload failed',
                    error: err.message
                });
            }
            next();
        });
    };
}

function multiFileUpload(defaultPath,para,maxCount = 10) {
    return (req, res, next) => {
        const filePath =defaultPath;
        const upload = fileUpload(filePath);

        upload.array(para,maxCount)(req, res, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'File upload failed',
                    error: err.message
                });
            }
            next();
        });
    };
}

module.exports = {
    singleFileUpload,
    multiFileUpload
};
