const fs = require('fs');
const path = require('path');

const getAllDirectories = (sourcePath) => {
  const directories = [sourcePath];

  function throughDirectory(directory) {
    fs.readdirSync(directory).forEach((item) => {
      const absolute = path.join(directory, item);
      if (!fs.statSync(absolute).isDirectory()) return;
      directories.push(absolute);
      throughDirectory(absolute);
    });
  }
  throughDirectory(sourcePath);

  return directories;
};

module.exports = getAllDirectories;
