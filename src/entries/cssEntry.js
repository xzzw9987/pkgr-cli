const
  fs = require('fs'),
  parseCSS = require('../parseAssets/parseCSS'),
  makeDeps = require('../utils/makeDepsMap'),
  {error} = require('../utils/print'),
  md5 = require('../utils/md5'),
  conf = require('../config/globalConf'),
  saveBundle = require('../utils/saveBundle'),
  bundlePath = require('../utils/bundlePath'),
  devServer = require('../devServer')()

module.exports = function cssEntry (filename) {
  const
    depsMap = makeDeps(),
    id = -1

  Object.defineProperty(depsMap, 'entryId', {value: parseInt(1000000 * Math.random(), 10), enumerable: false})

  processFile(filename, id)
  const
    content = depsMap.deps[id] && depsMap.deps[id].content || '',
    name = md5(content)

  Object.defineProperty(depsMap, 'filename', {value: `${name}.css`, enumerable: false})
  conf.env === 'production' ? saveBundle(`${name}.css`, content) : devServer.add(`${name}.css`, content)

  return {
    content,
    name: conf.env === 'production' ? bundlePath(`${name}.css`).relative : `${name}.css`,
    hash: name
  }

  function processFile (filename, id) {
    try {
      fs.statSync(filename)
    } catch (e) {
      error(`Can't find file: ${filename}`)
      return
    }
    return parseCSS(filename, id, depsMap, processFile)
  }
}
