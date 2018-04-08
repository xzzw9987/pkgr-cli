const globalConf = require('./config/global')
module.exports = config => {
  Object.assign(globalConf, config)
  const path = require('path')
  const jsEntry = require('./starter/script')
  const htmlEntry = require('./starter/html')
  const cssEntry = require('./starter/css')

  let {entry} = config
  if (typeof entry === 'string') entry = [entry]
  entry.forEach(filename => {
    switch (path.extname(filename)) {
      case '.html':
        htmlEntry(filename)
        break
      case '.js':
        jsEntry(filename)
        break
      case '.css':
        cssEntry(filename)
        break
      default :
        throw new Error(`Unrecognized file type ${path.extname(filename)} of ${filename}`)
    }
  })
}
