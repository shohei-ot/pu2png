pu2png
=========

Converet PlantUML text file to PNG, SVG, PlainText by NodeJS.  

Accessing to PlantUML server by internally.  
(http://www.plantuml.com/plantuml/)

## Install

```js
const pu2png = require('pu2png')
```

## Test

Converting `test/test.pu` to `test/test.png`.

```
npm test
```

## Simple usage

```js
pu2png.convert('path/to/file.pu').then((exportedFilePath) => {
  console.log('success: ' + exportedFilePath)
})
```

## Methods

- `convert`
- `setBaseDir`
- `setUrl`
- `setType`

### `convert (fromPath: String[, toPath: String])`

Convert PlantUML formated file.  
Automaticaly naming converted file using `fromPath` if `toPath` unspecified.  
(e.g.: `./fromFile.pu` -> `./fromFile.png`)  

return `Promise`.

| argument |  type  |                                                     description                                                      | required? |
| -------- | ------ | -------------------------------------------------------------------------------------------------------------------- | --------- |
| fromPath | String | From file path                                                                                                       | yep       |
| toPath   | String | Export filepath. If extension different with recieved data from PlantUML Server, appending true extension to suffix. | nope      |

Sample:

```js
pu2png.convert('./fromPath.pu', './toPath.svg').then((path) => {
  console.log('success: ' + path)
  // => './toPath.svg.png'
})
```

### `setBaseDir (path: String)`

Set base directory. (Default: `./`)

return `self` (pu2png object)

sample:

```js
const path = require('path')
pu2png.setBaseDir(path.resolve(__dirname, 'docs')).convert(...)
```

### `setUrl (url: String)`

Set using PlantUML Server. (Default: `http://www.plantuml.com/plantuml`)  

return `self` (pu2png object)

sample:

```js
pu2png.setUrl('http://{YourPlantUMLServer}').convert(...)
```

### `setType (type: String)`

Set convert type. (Default: 'img')  
Only can using next items for arguments. (2017-11-18)

- `'img'`
- `'svg'`
- `'txt'`

return `self` (pu2png object)

sample: 

```js
pu2png.setType('svg').convert(...)
```

---

#### memo

http://plantuml.com/code-javascript-synchronous