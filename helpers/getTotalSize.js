const fs = require('fs');
const getAllFiles = require('./getAllFiles');

const getTotalSize = (directoryPath) => {
    const arrayOfFiles = getAllFiles(directoryPath);

    let totalSize = 0;

    arrayOfFiles.forEach(function(filePath) {
        totalSize += fs.statSync(filePath).size;
    })

    return totalSize;
}

module.exports = getTotalSize;
