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

function fileUploader(filePath){
    
    const storage = multer.diskStorage({
        
        destination: function (req, file, cb) {
    
            const uploadPath = path.join(process.cwd(), filePath);
    
            // Create the directory if it doesn't exist
            fs.mkdirSync(uploadPath, { recursive: true });
    
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const formattedDate = formatDate(new Date());
            const randomNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            cb(null, formattedDate + randomNumber + file.originalname);
            console.log("file add")
        }
    });
    return multer({storage})
}
 
//const upload = multer({ storage: storage });

module.exports=fileUploader