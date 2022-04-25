const fs = require('fs');
const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');
const convertBytes = require('./helpers/convertBytes');
const getTotalSize = require('./helpers/getTotalSize');
const getAllDirectories = require('./helpers/getAllDirectories');
const getAllFiles = require('./helpers/getAllFiles');
const { createTmpDir, removeTmpDir } = require('./helpers/tmpDir');
const getFileSize = require('./helpers/getFileSize');
const moveFile = require('./helpers/moveFile');

const PACKAGE_NAME = 'image-optimist';
const PROCESSING_TIME = 'Processing time';

const imageOptimist = async (config) => {
  console.time(PROCESSING_TIME);
  console.log(`${PACKAGE_NAME} started`);

  const c = {
    sourcePath: null,
    destinationPath: null,
    smartMode: true,
    overwriteMode: false,
    ignoreDestinationFiles: false,
    mask: '*.{jpg,jpeg,png,svg,gif}',
    webp: [
      imageminWebp({
        quality: 90,
        method: 4,
        metadata: 'none',
      }),
    ],
    plugins: [
      imageminMozjpeg({
        quality: 90,
      }),
      imageminPngquant({
        speed: 4,
        strip: true,
        quality: [0.8, 1],
        dithering: false,
        verbose: true,
      }),
      imageminSvgo(),
      imageminGifsicle({
        optimizationLevel: 3,
      }),
    ],
    ...config,
  };

  const errors = [];
  if (c.sourcePath === null) errors.push('sourcePath is required');
  if (c.destinationPath === null) errors.push('destinationPath is required');
  if (c.overwriteMode && !c.smartMode) errors.push('overwriteMode is only available when smartMode is enabled');
  if (errors.length !== 0) {
    console.error(`${PACKAGE_NAME} finished with errors:\n`, JSON.stringify(errors));
    return;
  }

  const initialDirSize = getTotalSize(c.sourcePath);

  let tmpDir;
  try {
    const inputDirectories = getAllDirectories(c.sourcePath);

    if (c.smartMode) tmpDir = createTmpDir(PACKAGE_NAME);

    // Basic processing
    const outputDirectories = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const directory of inputDirectories) {
      const input = `${directory}/${c.mask}`;
      const output = directory.replace(c.sourcePath, c.smartMode ? tmpDir : c.destinationPath);
      const relativePath = `.${directory.replace(c.sourcePath, '')}`;
      outputDirectories.push(output);
      console.log(`Processing: ${relativePath}`);
      // eslint-disable-next-line no-await-in-loop
      await imagemin([input], {
        destination: output,
        plugins: c.plugins,
      });
    }

    // Conversion to webp
    if (c.webp) {
      // eslint-disable-next-line no-restricted-syntax
      for (const directory of outputDirectories) {
        const input = `${directory}/*.{jpeg,jpg,png}`;
        const relativePath = `.${directory.replace(c.smartMode ? tmpDir : c.destinationPath, '')}`;
        console.log(`Converting to WebP: ${relativePath}`);
        // eslint-disable-next-line no-await-in-loop
        await imagemin([input], {
          destination: directory,
          plugins: c.webp,
        });
      }
    }

    // Smart mode (see readme for details)
    if (c.smartMode) {
      const tmpFiles = getAllFiles(tmpDir);
      // eslint-disable-next-line no-restricted-syntax
      for (const tmpFile of tmpFiles) {
        const tmpFileSize = getFileSize(tmpFile);
        const sourceFile = tmpFile.replace(tmpDir, c.sourcePath);
        const sourceFileIsExists = fs.existsSync(sourceFile);
        const sourceFileSize = sourceFileIsExists ? getFileSize(sourceFile) : null;
        const candidate = tmpFile.replace(tmpDir, c.destinationPath);
        const candidateIsExists = fs.existsSync(candidate);
        const candidateSize = candidateIsExists ? getFileSize(candidate) : null;
        const candidateRelative = `.${candidate.replace(c.destinationPath, '')}`;

        if (c.overwriteMode ? candidateIsExists : true) {
          if (
            !candidateIsExists
              || !sourceFileIsExists
              || candidateSize === sourceFileSize
              || c.ignoreDestinationFiles
          ) {
            // eslint-disable-next-line no-nested-ternary
            if (candidateIsExists ? tmpFileSize < candidateSize : true) {
              moveFile(tmpFile, candidate);
              if (candidateIsExists) console.log(`Updated: ${candidateRelative}`);
              else console.log(`Created: ${candidateRelative}`);
            } else {
              console.log(`Not updated (already has optimal size): ${candidateRelative}`);
            }
          } else {
            console.warn(`Conflict: ${sourceFile} and ${candidate}\nThe source file and the file in the`
                + ' destination folder are not the same. You should replace an'
                + ' obsolete file with a more recent one to avoid erroneous overwriting.'
                + ' You can set ignoreDestinationFiles to true if you do not care about'
                + ' files in the destination folder.');
          }
        } else {
          console.log(`Not created (overwriteMode is enabled): ${candidateRelative}`);
        }
      }
    }

    const finalDirSize = getTotalSize(c.destinationPath);
    const diffDirSize = initialDirSize - finalDirSize;

    console.log(`Initial: ${convertBytes(initialDirSize)}`);
    console.log(`Final${c.webp ? ' + WebP' : ''}: ${convertBytes(finalDirSize)}`);
    console.log(`Diff: ${convertBytes(diffDirSize)}`);
    console.timeEnd(PROCESSING_TIME);
    console.log(`${PACKAGE_NAME} finished`);
  } catch (e) {
    console.error(`${PACKAGE_NAME} finished with error:\n`, e);
  } finally {
    try {
      if (tmpDir) {
        removeTmpDir(tmpDir);
      }
    } catch (e) {
      console.error(`An error has occurred while removing the temp folder at ${tmpDir}.`
          + 'Please remove it manually. Error:\n', e);
    }
  }
};

module.exports = imageOptimist;
