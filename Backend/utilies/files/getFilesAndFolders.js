const fs = require('fs').promises;
const path = require('path');
async function getFilesAndFolders(folderPath) {
  try {
    folderPath= path.join(process.cwd(), folderPath);
    const entries = await fs.readdir(folderPath, { withFileTypes: true });

    const files = [];
    const folders = [];

    for (const entry of entries) {
      if (entry.isFile()) {
        files.push(entry.name);
      } else if (entry.isDirectory()) {
        folders.push(entry.name);
      }
    }

    return { files, folders , success: true };
  } catch (err) {
    console.error(`Error in getting all the files and folder from ${folderPath}`, err);
    return { 
      success: false,
      error: `Error reading directory ${folderPath}`
    };
  }
}

module.exports = getFilesAndFolders;