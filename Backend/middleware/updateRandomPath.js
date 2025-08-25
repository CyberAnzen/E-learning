const Path = require('path');
//const crypto = require('crypto');
const moveFile = require('../utilies/files/moveFile'); 
const randomPathName = require('./randomPathName');
const customError = require("../utilies/customError");

/**
 * 
 * @param {string} path -the temp path of the uploaded files
 * @param {*} payload - the payload to be used for the prev random path name
 * @param {*} secPayload -the payload to be used for the new random path name

 */


function updateRandomPath(path,payload,secPayload) {
    return async (req, res, next) => {
        let data
        let relativePath = null;
        let dirPath
        try {
            data =req.body?.[payload]
            if(data && data.length > 0) {
                 try {
                    data= JSON.parse(data);
                  } catch (error) {
                    throw new customError("Invalid existingAttachments JSON", 400);
                  }
                const tempPath =req.customFileUpload.tempPath;
                relativePath = Array.isArray(data) ? data[0] : data;
                dirPath = Path.dirname(relativePath);
                console.log("dirPath:",dirPath);
                for (const element of req.files) {
                await moveFile(
                            element.filename,
                            tempPath,
                            dirPath
                        )}
                req.customFileUpload.randomPathName = dirPath;
                next();
            }
            else{
                return randomPathName(path,secPayload)(req, res, next);
            }


        } catch (error) {
            console.log("[updateRandomPath] error in the updateRandomPath middleware:", error);
            return res.status(500).json({
                success:false,
                //error: error.message,
                message: "An error occurred while updating the random path."
            });
            
        }
    }
}

module.exports = updateRandomPath;