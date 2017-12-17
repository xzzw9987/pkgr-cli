const
  watch = require('node-watch'),
  conf = require('../config/globalConf')
let files = new Set
module.exports = (entryId = '') => (filename, callback) => {
  if (conf.env === 'production') return
  if (!files.has(`${entryId}${filename}`)) {
    files.add(`${entryId}${filename}`)
    watch(filename, callback)
  }
}