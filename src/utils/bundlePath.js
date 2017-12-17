const
  path = require('path'),
  conf = require('../config/globalConf')

module.exports = filename => {
  const
    extpath = {'.js': 'js', '.css': 'css'},
    extname = path.extname(filename),
    p = path.resolve(conf.output.path, extpath[extname] || 'assets', filename),
    relative = conf.output.publicPath ? `${conf.output.publicPath}${filename}` : path.join(extpath[extname] || 'assets', filename)
  return {absolute: p, relative}
}