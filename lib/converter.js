'use strict'

const fs = require('fs')
const path = require('path')
// const {URL} = require('url')
const http = require('http')
const { setInterval, clearInterval } = require('timers')

const plantumlEncoder = require('plantuml-encoder')

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

  setBaseDir (path = '') {
    this.baseDir = path
    return this
  }
  setUrl (url = '') {
    this.url = url
    return this
  }
  setType (type = '') {
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
      console.log('fromSrc')
      console.log('```')
      console.log(fromSrc)
      console.log('```')

      const encorded = plantumlEncoder.encode(fromSrc)
      const convertedUrl = self._getUrl() + '/' + encorded
      console.log('convertedUrl = ' + convertedUrl)

      const writeStream = fs.createWriteStream(to, {flag: 'a'})
      writeStream.on('pipe', () => {
        console.log('#### writeStream pipe')
      })
      writeStream.on('drain', () => {
        console.log('#### writeStream drain')
      })
      writeStream.on('error', () => {
        console.log('#### writeStream error')
      })
      writeStream.on('finish', () => {
        console.log('#### writeStream finish')
      })
      writeStream.on('unpipe', () => {
        console.log('#### writeStream unpipe')
        writeStream.end()
      })
      writeStream.on('close', () => {
        console.log('#### writeStream close')
        resolve(to)
      })

      try {
        // const stream = fs.createReadStream(new URL(convertedUrl))
        // const stream = fs.createReadStream(convertedUrl)
        http.get(convertedUrl, res => {
          const { statusCode } = res
          // const contentType = res.headers['content-type']

          if (statusCode !== 200) {
            throw new Error('Failed get url')
          }

          let st

          res.pipe(writeStream)
          res.on('data', chunc => {
            res.pause()
            console.log('### response data', chunc)
            st = writeStream.write(chunc, 'binary', () => {
              console.log('### write.end', st)
              if (st) {
                console.log('>>> resume!!')
                res.resume()
              } else {
                let wait
                wait = setInterval(() => {
                  if (st) {
                    clearInterval(wait)
                    console.log('>>> resume!! (waited')
                    res.resume()
                    // TODO: 適切なタイミングで閉じれていない？
                  }
                }, 100)
              }
            })
            console.log('>>> paused...')
          })
          res.once('drain', chunc => {
            console.log('### respolnse drain')
            writeStream.write(chunc, 'binary')
          })
          res.on('end', () => {
            console.log('### response END ###')
          })
        })
      } catch (e) {
        console.log('Err: #3')
        throw e
      }
      // resolve(to)
    })
  }

  // TODO: render
}

// export default Converter
module.exports = Converter