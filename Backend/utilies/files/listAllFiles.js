const fs = require('fs').promises;
const path = require('path');

async function listAllFiles(folderPath) {
  try {
    folderPath= path.join(process.cwd(), folderPath);
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    const files = entries
      .filter(entry => entry.isFile())
      .map(entry => entry.name);
    console.log('Only files:', files);
     return { files, success: true };
  } catch (err) {
    console.error(`Error in getting all the file in ${folderPath}:`, err);
     return { 
      success: false,
      error: `Error reading directory ${folderPath}`
    };
  }
}
module.exports= listAllFiles