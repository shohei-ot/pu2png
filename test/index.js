'use strict'
const fs = require('fs')
const path = require('path')
// import pu2png from '../index.js'
const pu2png = require('../index.js')

pu2png.convert('test.pu').then((toPath) => {
  console.log('SUCCESS: ' + toPath)
  return true
}, (err) => {
  console.log('FAILED: ' + err.message)
  try {
    const toPath = path.resolve(__dirname, 'test.png')
    fs.statSync(toPath)
    fs.unlinkSync(toPath)
  } catch (e) {
  }
  throw err
}).then((args) => {
  console.log('finished')
})
