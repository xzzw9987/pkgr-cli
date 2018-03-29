const
  fs = require('fs'),
  path = require('path'),
  {error} = require('../utils/print'),
  Entry = require('../core/entry'),
  parseJS = require('../parsers/script')

let entryID = 0

module.exports = async filename => {
  const entry = new Entry(entryID++)
  await processFile({entry, filename})
  console.log(entry)
  debugger

  async function processFile ({entry, filename, chunk}) {
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
          nextCall: processFile
        })
        break
      // case '.css':
      //   parseCSS(filename, id, depsMap, processFile)
      //   break
      // default:
      //   parseResource(filename, id, depsMap, processFile)
      //   break
    }
  }
}