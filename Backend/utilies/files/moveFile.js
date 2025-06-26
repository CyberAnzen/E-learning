const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

async function moveFile(fileName, oldPath,newPath) {
  try {
    if (!fileName || !oldPath || !newPath) {
        return {
            success: false,
            error: 'File name, old path, and new path are required.'}
    }
    if (!fsSync.existsSync(path.join(process.cwd(), newPath))) {
        fsSync.mkdirSync(path.join(process.cwd(), newPath), { recursive: true });
    }
    //console.log('Renaming file:', oldFileName, 'to', newFileName, 'in', filePath);
    const oldFullPath= path.join(process.cwd(),oldPath, fileName);
    const newFullPath = path.join(process.cwd(), newPath, fileName);
    //console.log('Renaming file(after):', oldFileName, 'to', newFileName, 'in', filePath);
    await fs.rename(oldFullPath, newFullPath);
    console.log('File moved successfully from', oldFullPath, 'to', newFullPath);
    return { 
      success: true, 
      message: 'File moved successfully'};
  } catch (err) {
    console.error('Error moving file:', err);
    return { 
      success: false, 
      error: `Error moving file: ${err.message}` };
  }
}

module.exports = moveFile;
