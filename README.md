# image-optimist

A utility for processing and converting images to the requirements of the modern web.

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
