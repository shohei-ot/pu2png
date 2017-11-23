'use strict'

const fs = require('fs')
const path = require('path')
// const {URL} = require('url')
const http = require('http')

// const plantumlEncoder = require('plantuml-encoder')
const Encoder = require('./encoder')

class Converter {
  constructor (baseDir = './', url = 'http://www.plantuml.com/plantuml', type = 'img') {
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

  setBaseDir (path) {
    this.baseDir = path
    return this
  }
  setUrl (url) {
    this.url = url
    return this
  }
  setType (type) {
    this.type = type
    return this
  }

  convert (fromPath = '', toPath = false) {
    const self = this
    return new Promise((resolve, reject) => {
      const from = path.resolve(self.baseDir, fromPath)
      const _toPath = toPath || fromPath.replace(/\..+$/, '')
      let to = path.resolve(self.baseDir, _toPath)

      let fromSrc = ''
      try {
        fromSrc = fs.readFileSync(from, { encoding: 'utf8' })
      } catch (e) {
        console.log('Err: #1')
        throw new Error('Failed read file :: ' + e.message)
      }
      fromSrc = fromSrc.replace(/(\r|\n)/gm, "\r\n")

      const encorded = Encoder.encode(fromSrc)
      const convertedUrl = self._getUrl() + '/' + encodeURIComponent(encorded)
      console.log('> url', convertedUrl)

      let writeStream
      try {
        const client = http.get(convertedUrl)
        client.on('response', stream => {
          const { statusCode } = stream
          if (statusCode !== 200) {
            throw new Error('Failed get url')
          }
          const contentType = stream.headers['content-type']
          let ext = self._detectExt(contentType)
          if (!self._isEqExt(to, ext)) {
            to += '.' + ext
          }
          writeStream = fs.createWriteStream(to, {flag: 'a'})

          let streamEnd = false

          writeStream.on('finish', () => {
            // console.log('#### writeStream finish')
          })
          writeStream.on('close', () => {
            // console.log('#### writeStream close')
            // resolve(to)
            resolve(to)
          })

          // let writeStatus
          stream.on('data', chunc => {
            stream.pause()
            // writeStatus = writeStream.write(chunc, () => {
            writeStream.write(chunc, () => {
              // console.log('writeStatus', writeStatus)
              if (streamEnd) {
                writeStream.end()
              } else {
                stream.resume()
              }
            })
          })
          stream.once('drain', chunc => {
            // console.log('### respolnse drain')
            // writeStatus = writeStream.write(chunc, 'binary', () => {
            writeStream.write(chunc, 'binary', () => {
              // console.log('writeStatus', writeStatus)
              writeStream.end()
            })
          })
          stream.on('close', () => {
            // console.log('streamClose')
            streamEnd = true
          })
        })
      } catch (e) {
        if (writeStream) {
          writeStream.end()
          fs.unlinkSync(to)
        }
        console.log('Err: #3')
        throw e
      }
    })
  }

  /**
   * Detecting extension from Content-Type(MIME Type)
   * @param {String} contentType mime-type
   * @return {String}            extension string. false if undefined content-type in this method.
   */
  _detectExt (contentType) {
    if (typeof contentType === 'undefined') throw new Error('required contentType argument')
    if (contentType.indexOf('image/png') !== -1) return 'png'
    if (contentType.indexOf('image/svg') !== -1) return 'svg'
    if (contentType.indexOf('test/plain') !== -1) return 'txt'
    return false
  }

  /**
   * Check filepath and extension
   * @param {String} filePath /path/to/file.name
   * @param {String} ext      extension you want check. e.g.) "png", ".png"
   * @return {Bool}
   */
  _isEqExt (filePath, ext) {
    const _ext = ext.replace(/^\./, '')
    const reg = new RegExp(`\\.${_ext}\$`)
    return reg.test(filePath)
  }
}

// export default Converter
module.exports = Converter
