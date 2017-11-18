pu2png
=========

Converet PlantUML text file to PNG, SVG, PlainText by NodeJS.  

Accessing to PlantUML server by internally.  
(ref: http://www.plantuml.com/plantuml/)

## Install

```js
const pu2png = require('pu2png')
```

## Usage

```js
pu2png.convert('path/to/file.pu').then((exportedFilePath) => {
  console.log('success')
})
```

## API

### `convert (fromFilePath: String[, exportFilePath: String])`
### `setBaseDir (path: String)`
### `setUrl (url: String)`
### `setType (type: String)`