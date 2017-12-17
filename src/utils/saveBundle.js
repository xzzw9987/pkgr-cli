const
  fs = require('fs'),
  bundlePath = require('./bundlePath'),
  ensureDirectoryExistence = require('./ensureDirectoryExistence')

module.exports = function (filename, content) {
  const {absolute: p} = bundlePath(filename)

  ensureDirectoryExistence(p)
  fs.writeFileSync(p, content)
}