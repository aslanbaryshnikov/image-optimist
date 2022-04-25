# image-optimist

A utility for processing and converting images to the requirements of the modern web.

## Features

- Recursive directory optimization
- Keeping the original directory hierarchy
- Flexible behavior customization

## Install

```shell
$ npm install --save-dev image-optimist
```

## Usage

```js
const path = require('path');
const imageOptimist = require('image-optimist');

(async () => {
    await imageOptimist({
        sourcePath: path.join(__dirname, 'from'),
        destinationPath: path.join(__dirname, 'to'),
    });
})();
```

## API

### imageOptimist(config)

Returns `Promise<void>`.

#### config

Type: `Object`

##### sourcePath

Type: `String`

Set the source folder.
Keep in mind that the subfolders will be included in the processing and the output files will retain their original hierarchy.

##### destinationPath

Type: `String`

Set the destination folder. The folder does not need to be empty, but images with the same name will be overwritten.

##### smartMode?

Type: `Boolean`<br>
Default `true`

If true, moves the file if there is no file with the same name in the destination folder, or if the processed file is smaller.

##### overwriteMode?

Type: `Boolean`<br>
Default `false`

If true, only existing files in the destination folder will be overwritten. If your destination folder is empty, there will be no changes (because nothing to update). Only available when smartMode is enabled.

##### ignoreDestinationFiles?

Type: `Boolean`<br>
Default `false`

If true, disables checking that the source file and the file in the destination folder do not match. True is recommended only if you don't care about files in the destination folder.

Note: In most cases, you should replace an obsolete file with a more recent one to avoid erroneous overwriting.

##### mask?

Type: `String`<br>
Default: `'*.{jpg,jpeg,png,svg,gif}'`

See [Glob patterns](https://github.com/sindresorhus/globby#globbing-patterns).

##### webp?

Type: `Array || Boolean`<br>
Default: `[imageminWebp()]`

By default, the optimal settings for generating WebP images are passed to the imageminWebp instance (see package source code for details). You can pass in your imageminWebp instance with the desired settings, or pass false if you want to disable the generation of images in WebP format.

##### plugins?

Type: `Array`<br>
Default: `[imageminMozjpeg(), imageminPngquant(), imageminSvgo(), imageminGifsicle()]`

By default, optimal settings are passed to plugin instances (see package source code for details). You can pass your array with the plugins and settings you want.
