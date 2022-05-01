# epub [![Build Status](https://travis-ci.org/julien-c/epub.svg?branch=master)](https://travis-ci.org/julien-c/epub)

**epub** is a node.js module to parse EPUB electronic book files.

**NB!** Only ebooks in UTF-8 are currently supported!.

## Installation

    npm install epub

[zipfile](https://www.npmjs.com/package/zipfile) will be used if it is
installed, but it is not a dependency or optional dependency. Install it
globally if you want to use it. The version that was required used
deprecated packages and it hasn't been updated in 4 years.
[Issue 83](https://github.com/mapbox/node-zipfile/issues/83) indicates that
it fails to build on node v12 and the author has not responded to the issue
in over 2 years.

## Usage

```js
import EPub from '@ig3/epub';
const epub = new EPub(pathToFile, imageWebRoot, chapterWebRoot);
```

OR

```js
const EPub = require('@ig3/epub');
const epub = new EPub(pathToFile, imageWebRoot, chapterWebRoot);
```

Where

  * **pathToFile** is the file path to an EPUB file
  * **imageWebRoot** is the prefix for image URL's. If it's */images/* then the actual URL (inside chapter HTML `<img>` blocks) is going to be */images/IMG_ID/IMG_FILENAME*, `IMG_ID` can be used to fetch the image form the ebook with `getImage`. Default: `/images/`
  * **chapterWebRoot** is the prefix for chapter URL's. If it's */chapter/* then the actual URL (inside chapter HTML `<a>` links) is going to be */chapters/CHAPTER_ID/CHAPTER_FILENAME*, `CHAPTER_ID` can be used to fetch the image form the ebook with `getChapter`. Default: `/links/`
 
Before the contents of the ebook can be read, it must be opened (`EPub` is an `EventEmitter`).

```js
epub.on('end', function() {
  // epub is initialized now
  console.log(epub.metadata.title)

  epub.getChapter('chapter_id', (err, text) => {})
})

epub.parse()
```

## events

### error

Emitted every time there is an error during parsing of the epub file.

Passed an instance of Error.

### end

Emitted when parsing is complete.

## methods

### constructor

Returns a new instance of EPub.

```js
const epub = new EPub(pathToFile, imageroot, linkroot);
```

 * pathToFile <string>
 * imageroot <string>
 * linkroot <string>

`pathToFile` is the file path to an EPUB file

`imageWebRoot` is the prefix for image URL's. If it's */images/* then the actual URL (inside chapter HTML `<img>` blocks) is going to be */images/IMG_ID/IMG_FILENAME*, `IMG_ID` can be used to fetch the image form the ebook with `getImage`. Default: `/images/`

`chapterWebRoot` is the prefix for chapter URL's. If it's */chapter/* then the actual URL (inside chapter HTML `<a>` links) is going to be */chapters/CHAPTER_ID/CHAPTER_FILENAME*, `CHAPTER_ID` can be used to fetch the image form the ebook with `getChapter`. Default: `/links/`
 
### parse([options])

Initiate parsing of the epub file. The epub object is an event emitter. All
results come by way of events.

The options object can be used to pass options.xml2jsOptions, to override
the defaults for [xml2js](https://www.npmjs.com/package/xml2js), which are
the '0.1' defaults. Note that the options must be set in
options.xml2jsOptions, not in options directly.

### walkNavMap

Returns an array of objects for the TOC. This is written in a way that it
might be useful independent of the parser, but it isn't obvious. It might
be for internal use only.

### getChapter(id, callback)

Returns the content of a chapter, given the manifest ID of the chapter.

id is a string: the manifest ID of the chapter to retrieve.

callback is a function which will be called with arguments err and str,
where str is the content of the chapter, as a string.

If the chapter content includes `<body>...</body>` then only the content of
the body tag is returned.

Script and style blocks and onEvent handlers are removed.

Image and link paths are modified according to imageroot and linkroot
passed to the EPub constructor.

The chapter file is assumed to be utf-8 encoded. There is no option to
change the encoding.

### getChapterRaw(id, callback)

Like getChapter except that the full content of the chapter is returned
without transformations.

The chapter file is assumed to be utf-8 encoded. There is no option to
change the encoding.

### getImage(id, callback)

Returns the content of an image file as a Buffer.

The image file mime type must be `image/*`.

### getFile(id, callback)

 * id <string>
 * callback <function>

`id` is the Manifest id of the file to be read

`callback(err, data, mediaType)` is the callback function. The data is a
Buffer.


### readFile(filename[, options], callback)

 * filename <string>
 * options <string>
 * callback <function>

`filename` is the path of an epub file.

`options` is the encoding of the epub file.

`callback` is a function that is called with the decoded, stringified file
contents.


### hasDRM

Parses the tree to see if there is an encryption file, signifying the
presence of DRM.

Returns true if the zip file includes `META-INF/encryption.xml`, otherwise
returns false.

## metadata

Property of the *epub* object that holds several metadata fields about the book.

```js
epub.metadata
```

Available fields:

  * **creator** Author of the book (if multiple authors, then the first on the list) (*Lewis Carroll*)
  * **creatorFileAs** Author name on file (*Carroll, Lewis*)
  * **title** Title of the book (*Alice's Adventures in Wonderland*)
  * **language** Language code (*en* or *en-us* etc.)
  * **subject** Topic of the book (*Fantasy*)
  * **date** creation of the file (*2006-08-12*)
  * **description**

## flow

*flow* is a property of the *epub* object and holds the actual list of chapters (TOC is just an indication and can link to a # url inside a chapter file)

```js
epub.flow.forEach(chapter => {
    console.log(chapter.id)
})
```

Chapter `id` is needed to load the chapters `getChapter`

## toc
*toc* is a property of the *epub* object and indicates a list of titles/urls for the TOC. Actual chapter and it's ID needs to be detected with the `href` property


## getChapter(chapter_id, callback)

Load chapter text from the ebook.

```js
epub.getChapter('chapter1', (error, text) => {})
```

## getChapterRaw(chapter_id, callback)

Load raw chapter text from the ebook.

## getImage(image_id, callback)

Load image (as a Buffer value) from the ebook.

```js
epub.getImage('image1', (error, img, mimeType) => {})
```

## getFile(file_id, callback)

Load any file (as a Buffer value) from the ebook.

```js
epub.getFile('css1', (error, data, mimeType) => {})
```
