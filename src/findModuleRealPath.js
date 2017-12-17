const
  fs = require('fs'),
  path = require('path')

function d (dirname, depPath) {
  let p = path.resolve(dirname, depPath)
  if (!depPath.startsWith('.')) {
    // Load from node_modules
    p = path.resolve(path.join(dirname, 'node_modules'), depPath)
  }
  try {
    const stat = fs.lstatSync(p)
    if (stat.isDirectory()) {
      try {
        const packageJSON = JSON.parse(fs.readFileSync(path.join(p, 'package.json')).toString()),
          main = packageJSON.main
        if (main) return path.join(p, main)
        return path.join(p, 'index.js')
      }
      catch (e) {
        return path.join(p, 'index.js')
      }
    }
    else if (stat.isSymbolicLink()) {
      const s = fs.realpathSync(p)
      return d(path.dirname(s), path.basename(s))
    }
    else if (stat.isFile()) {
      return p
    }
  }
  catch (e) {
    if (path.extname(p) === '')
      return d(dirname, depPath + '.js')
    if (!depPath.startsWith('.'))
      return d(path.dirname(path.resolve(dirname)), depPath)
  }
}

module.exports = d