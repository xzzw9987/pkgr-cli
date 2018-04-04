const fs = require('fs')
const path = require('path')
const {error} = require('../utils/print')
const Entry = require('../core/entry')
const parseJS = require('../parsers/script')
const parseStylesheet = require('../parsers/css')
const ScriptBundler = require('../bundlers/script')
const EventTypes = require('../utils/eventTypes')
const perf = require('../utils/perf')

let entryID = 0

module.exports = async filename => {
  const entry = new Entry(entryID++)
  const bundler = new ScriptBundler(entry)
  const bundlePerf = perf()

  await processFile({entry, filename, bundler})
  bundlePerf.end()
  bundlePerf.entryInfo(entry)

  entry.subscribe(EventTypes.MODULE_UPDATE, () => {
    bundler.bundle(filename)
  })

  return bundler.bundle(filename)

  async function processFile ({entry, filename, chunk, bundler}) {
    try {
      fs.statSync(filename)
    } catch (e) {
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
