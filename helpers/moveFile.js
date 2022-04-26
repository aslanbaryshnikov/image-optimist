const fs = require('fs');
const path = require('path');

const moveFile = (from, to) => {
  if (path.extname(to)) {
    const dir = path.dirname(to);
    fs.mkdirSync(dir, { recursive: true });
    fs.renameSync(from, to);
  } else {
    const basename = path.basename(from);
    fs.mkdirSync(to, { recursive: true });
    fs.renameSync(from, path.join(to, basename));
  }
};

module.exports = moveFile;
