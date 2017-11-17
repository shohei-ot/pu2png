'use strict'
// import pu2png from '../index.js'
const pu2png = require('../index.js')

pu2png.setBaseDir(__dirname).convert('test.pu', 'test.png').then((toPath) => {
  console.log('### Success!: ' + toPath)
  return true
}, (err) => {
  console.log('### Failed!: ' + err.message)
  return false
})
