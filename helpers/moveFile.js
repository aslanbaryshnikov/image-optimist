const fs = require('fs');
const path = require('path');

const moveFile = (from, to) => {
  const dir = path.dirname(to);
  fs.mkdirSync(dir, { recursive: true });
  fs.renameSync(from, to);
};

module.exports = moveFile;
