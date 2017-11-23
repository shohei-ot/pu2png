const compress = require('./compress.js')

class Encoder {
  encode (plantUmlTxt) {
    return compress(plantUmlTxt)
  }
}

module.exports = new Encoder()
