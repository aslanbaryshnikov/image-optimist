const fs = require('fs');

const getFileSize = (filePath) => fs.statSync(filePath).size;

module.exports = getFileSize;
