const
  fs = require('fs'),
  path = require('path'),
  generateBundle = require('../generateBundle'),
  parseJS = require('../parseAssets/parseJS'),
  parseCSS = require('../parseAssets/parseCSS'),
  parseResource = require('../parseAssets/parseResource'),
  makeDeps = require('../utils/makeDepsMap'),
  makeModuleId = require('../utils/makeModuleId'),
  {error} = require('../utils/print'),
  md5 = require('../utils/md5'),
  conf = require('../config/globalConf'),
  devServer = require('../devServer')(),
  saveBundle = require('../utils/saveBundle'),
  bundlePath = require('../utils/bundlePath')

module.exports = function jsEntry (filename) {
  const
    entryId = parseInt(Math.random() * 10e6, 10),
    id = makeModuleId(entryId),
    depsMap = makeDeps()

  Object.defineProperty(depsMap, 'entryId', {value: entryId, enumerable: false})
  processFile(filename, id)

  const
    content = generateBundle(depsMap.deps),
    name = md5(content)

  Object.defineProperty(depsMap, 'filename', {value: `${name}.js`, enumerable: false})
  conf.env === 'production' ? saveBundle(`${name}.js`, content) : devServer.add(`${name}.js`, content)
  return {
    content,
    depsMap,
    name: conf.env === 'production' ? bundlePath(`${name}.js`).relative : `${name}.js`
  }

  function processFile (filename, id) {
    try {
      fs.statSync(filename)
    }
    catch (e) {
      error(`Can't find file: ${filename}`)
      return
    }

    switch (path.extname(filename)) {
      case '.js':
        parseJS(filename, id, depsMap, processFile)
        break
      case '.css':
        parseCSS(filename, id, depsMap, processFile)
        break
      default:
        parseResource(filename, id, depsMap, processFile)
        break
    }
  }
}
