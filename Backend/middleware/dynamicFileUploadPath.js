const fileUpload = require('../utilies/FileUploder'); // adjust path as needed
const crypto = require('crypto');

// Reusable middleware generator
function singleFileUpload(defaultPath,para, config = {}, randomFileName = true) {
    return (req, res, next) => {
        const filePath =defaultPath;
        const upload = fileUpload(filePath,config, randomFileName);

        upload.single(para)(req, res, (err) => {
            if (err) {
                console.error('[dynamicFileUploadPath] [singleFileUpload] Error during file upload:', err);
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

function multiFileUpload(defaultPath,para,maxCount = 10, config = {}, randomFileName = true) {
    return (req, res, next) => {
        const filePath =defaultPath;
        const upload = fileUpload(filePath,config, randomFileName);

        upload.array(para,maxCount)(req, res, (err) => {
            if (err) {
                console.error('[dynamicFileUploadPath] [multiFileUpload] Error during file upload:', err);
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


function dynamicFileUpload(option = {
    type: "single",
    tempPath: "temp",
    para: "file",
    defaultPath: "",
    maxCount: 10,
    randomFileName: true,
   // randomPathName: false,
    config: {}
}) {
    return (req, res, next) => {
        try {


            
            req.customFileUpload = { ...option };

            if (option.type === "single") {
                return singleFileUpload(option.tempPath, option.para, option.config, option.randomFileName)(req, res, next);
            } 
            else if (option.type === "multi") {
                return multiFileUpload(option.tempPath, option.para, option.maxCount, option.config, option.randomFileName)(req, res, next);
            } 
            else {
                console.error('[dynamicFileUploadPath] [DynamicFileUpload] Invalid upload type:', option.type);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid upload type specified. Use "single" or "multi".'
                });
            }
        } catch (error) {
            console.error('[dynamicFileUploadPath] [DynamicFileUpload] Error setting up file upload middleware:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while setting up file upload middleware.',
                error: error.message
            });
        }
    };
}





module.exports = {
    singleFileUpload,
    multiFileUpload,
    dynamicFileUpload
};
