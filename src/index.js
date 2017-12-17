const globalConf = require('./config/globalConf')
module.exports = config => {
  Object.assign(globalConf, config)
  const
    path = require('path'),
    jsEntry = require('./entries/jsEntry'),
    htmlEntry = require('./entries/htmlEntry'),
    cssEntry = require('./entries/cssEntry')

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