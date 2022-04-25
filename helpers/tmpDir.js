const fs = require('fs');
const path = require('path');
const os = require('os');

const createTmpDir = (prefix) => fs.mkdtempSync(path.join(os.tmpdir(), prefix));

const removeTmpDir = (tmpDir) => fs.rmSync(tmpDir, { recursive: true });

module.exports = {
  createTmpDir,
  removeTmpDir,
};
