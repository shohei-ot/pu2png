'use strict';

const fs = require('fs')
const path = require('path')
// const {URL} = require('url')
const {URL} = require('url')

const plantumlEncoder = require('plantuml-encoder');

class Converter {
  constroctor(baseDir = './', url = 'http://www.plantuml.com/plantuml', type = 'png') {
    this.baseDir = baseDir
    this.url = url
    this.type = type
  }

  _getUrl () {
    let _url = this.url
    if (/\/$/.test(_url)) {
      _url = _url.replace(/\/$/, '')
    }
    const url = `${_url}/${this.type}`
    return url
  }

  setBaseDir(path='') {
    this.baseDir = path
    return this
  }
  setUrl (url='') {
    this.url = url
    return this
  }
  setType (type='') {
    this.type = type
    return this
  }

  convert (fromPath = '', toPath = '') {
    const self = this
    return new Promise((resolve, reject) => {
      const from = path.resolve(self.baseDir, fromPath)
      const to = path.resolve(self.baseDir, toPath)

      let fromSrc = ''
      try {
        fromSrc = fs.readFileSync(from, { encoding: 'utf8' })
      } catch (e) {
        console.log('Err: #1')
        throw new Error('Failed read file :: ' + e.message)
      }

      const encorded = plantumlEncoder.encode(fromSrc)
      const convertedUrl = self._getUrl() + '/' + encorded

      try {
        const stream = fs.createReadStream(new URL(convertedUrl))
        // stream.on('data', (data) => {
        //   console.log(data)
        // })
        // stream.on('end', () => {
        //   console.log('END')
        // })
        let chunc
        try {
          while (null !== (chunc = stream.read(1024))) {
            fs.appendFileSync(to, chunc, { encoding: 'binary' })
          }
        } catch (err) {
          console.log('Err: #2')
          throw err
        }
      } catch (e) {
        console.log('Err: #3')
        throw e
      }
      resolve(to)
    })
  }

  // TODO: render
}

// export default Converter
module.exports = Converter