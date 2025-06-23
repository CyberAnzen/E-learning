const fs = require('fs').promises;
const path = require('path');

async function renameFile(filePath, oldFileName,newFileName) {
  try {
    //console.log('Renaming file:', oldFileName, 'to', newFileName, 'in', filePath);
    const oldname= path.join(process.cwd(),filePath, oldFileName);
    const newname = path.join(process.cwd(), filePath, newFileName);
    //console.log('Renaming file(after):', oldFileName, 'to', newFileName, 'in', filePath);
    await fs.rename(oldname, newname);
    console.log('File renamed successfully from', oldFileName, 'to', newFileName);
    return { 
      success: true, 
      message: 'File renamed successfully'};
  } catch (err) {
    console.error('Error renaming file:', err);
    return { 
      success: false, 
      error: `Error renaming file: ${err.message}` };
  }
}

module.exports = renameFile;
