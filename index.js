const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');
const convertBytes = require('./helpers/convertBytes');
const getTotalSize = require('./helpers/getTotalSize');
const getAllDirectories = require('./helpers/getAllDirectories');

const PACKAGE_NAME = 'image-optimist';
const PROCESSING_TIME = 'Processing time';

const imageOptimist = async (config) => {
  console.time(PROCESSING_TIME);
  console.log(`${PACKAGE_NAME} started`);

  const c = {
    sourcePath: null,
    destinationPath: null,
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
  if (errors.length !== 0) console.error(JSON.stringify(errors));

  const initialDirSize = getTotalSize(c.sourcePath);

  try {
    const inputDirectories = getAllDirectories(c.sourcePath);

    // Basic processing
    const outputDirectories = [c.destinationPath];
    // eslint-disable-next-line no-restricted-syntax
    for (const directory of inputDirectories) {
      const input = `${directory}/${c.mask}`;
      const output = directory.replace(c.sourcePath, c.destinationPath);
      const relativePath = `.${directory.replace(c.sourcePath, '')}`;
      outputDirectories.push(output);
      console.log(`Images from ${relativePath} are being processed...`);
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
        const relativePath = `.${directory.replace(c.destinationPath, '')}`;
        console.log(`Images from ${relativePath} are being converted to webp...`);
        // eslint-disable-next-line no-await-in-loop
        await imagemin([input], {
          destination: directory,
          plugins: c.webp,
        });
      }
    }
  } catch (e) {
    console.error(`${PACKAGE_NAME} finished with error:\n`, e);
    return;
  }

  const finalDirSize = getTotalSize(c.destinationPath);
  const diffDirSize = initialDirSize - finalDirSize;

  console.log(`Initial: ${convertBytes(initialDirSize)}`);
  console.log(`Final${c.webp ? ' + webp' : ''}: ${convertBytes(finalDirSize)}`);
  console.log(`Diff: ${convertBytes(diffDirSize)}`);
  console.timeEnd(PROCESSING_TIME);
  console.log(`${PACKAGE_NAME} finished`);
};

module.exports = imageOptimist;
