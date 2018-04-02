const
  {log} = require('../utils/print'),
  Table = require('cli-table'),
  path = require('path')

module.exports = () => {
  const beginTime = +(new Date)
  return {
    end () { log(`Time elapsed: ${+(new Date) - beginTime}ms`) },
    entryInfo (entry) {
      return
      const table = new Table({
        head: ['ID', 'Path', 'Size']
      })
      Object
        .keys(entry.modules)
        .forEach(moduleId => {
          table.push([
            moduleId,
            path.relative(process.cwd(), entry.modules[moduleId].filename),
            `${Buffer.byteLength(entry.modules[moduleId].code)} Bytes`
          ])
        })
      log(table.toString())
    }
  }
}