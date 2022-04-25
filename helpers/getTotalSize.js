const getAllFiles = require('./getAllFiles');
const getFileSize = require('./getFileSize');

const getTotalSize = (directoryPath) => {
  const arrayOfFiles = getAllFiles(directoryPath);

  let totalSize = 0;

  arrayOfFiles.forEach((filePath) => {
    totalSize += getFileSize(filePath);
  });

  return totalSize;
};

module.exports = getTotalSize;
