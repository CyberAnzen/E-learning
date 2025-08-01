const multer = require("multer");
const path = require("path");
const fs = require("fs");

function formatDate(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const yy = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
  
    return `${dd}.${mm}.${yy}-${hh}.${min}.${ss}-`;
  }
//const currentDate = new Date(); 

/**
 * @param {Object} [options={}] - Configuration object
 * @param {string} [options.filePath="uploads"] - Destination path for the uploaded file
 * @param {Array<string>} [options.allowedTypes=[]] - Allowed MIME types (empty = all allowed)
 * @param {number} [options.maxSize] - Maximum allowed file size in bytes
 * @returns {multer.Instance} - Multer middleware
 */
function fileUploader(filePath,{ allowedTypes = [], maxSize } = {}) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(process.cwd(), filePath);
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const formattedDate = formatDate(new Date());
            const randomNumber = Math.floor(Math.random() * 900000) + 100000;
            cb(null, formattedDate + randomNumber + file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (allowedTypes.length === 0 || allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type: ${file.mimetype}`), false);
        }
    };

    return multer({
        storage,
        fileFilter,
        limits: maxSize ? { fileSize: maxSize } : undefined
    });
}

//const upload = multer({ storage: storage });




module.exports = fileUploader;