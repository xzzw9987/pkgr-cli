const
  fs = require('fs'),
  path = require('path'),
  {error} = require('../utils/print'),
  Entry = require('../core/entry'),
  parseJS = require('../parsers/script'),
  parseStylesheet = require('../parsers/css'),
  ScriptBundler = require('../bundlers/script'),
  perf = require('../utils/perf')

let entryID = 0

module.exports = async filename => {
  const
    entry = new Entry(entryID++),
    bundler = new ScriptBundler(entry),
    bundlePerf = perf()

  await processFile({entry, filename, bundler})
  bundlePerf.end()
  bundlePerf.entryInfo(entry)

  return await bundler.bundle(filename)

  async function processFile ({entry, filename, chunk, bundler}) {
    try {
      fs.statSync(filename)
    }
    catch (e) {
      error(`Can't find file: ${filename}`)
      return
    }
    switch (path.extname(filename)) {
      case '.js':
        await parseJS({
          filename,
          entry,
          chunk,
          bundler,
          nextCall: processFile
        })
        break
      case '.css':
        await parseStylesheet({
          filename,
          entry,
          chunk,
          bundler,
          nextCall: processFile
        })
        break
      // default:
      //   parseResource(filename, id, depsMap, processFile)
      //   break
    }
  }
}