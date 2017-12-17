const
  fs = require('fs'),
  path = require('path'),
  conf = require('./getConfig'),
  ensureDirectoryExistence = require('./utils/ensureDirectoryExistence')

module.exports = function (filename, content) {
  const
    extHash = {'.js': 'js', '.css': 'css'},
    extname = path.extname(filename),
    p = path.resolve(conf.output.path, extHash[extname] || 'assets', filename)
  ensureDirectoryExistence(p)
  fs.writeFileSync(p, content)
}