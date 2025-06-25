const fs = require('fs').promises;
const path = require('path');

async function moveFile(fileName, oldPath,newPath) {
  try {
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
