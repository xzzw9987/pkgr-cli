const
  // fs = require('fs'),
  // path = require('path'),
  resolve = require('resolve')

function d (dirname, depPath) {
  return resolve.sync(depPath, {basedir: dirname})
  // let p = path.resolve(dirname, depPath)
  // if (!(depPath.startsWith('.') || depPath.startsWith('/'))) {
  //   // Load from node_modules
  //   p = path.resolve(path.join(dirname, 'node_modules'), depPath)
  // }
  // try {
  //   const stat = fs.statSync(`${p}.js`)
  //   if (stat.isFile()) return `${p}.js`
  // }
  // catch (e) {}
  //
  // try {
  //   const stat = fs.lstatSync(p)
  //   if (stat.isFile()) {
  //     return p
  //   }
  //   else if (stat.isSymbolicLink()) {
  //     const s = fs.realpathSync(p)
  //     return d(path.dirname(s), path.basename(s))
  //   }
  //   else if (stat.isDirectory()) {
  //     try {
  //       const packageJSON = JSON.parse(fs.readFileSync(path.join(p, 'package.json')).toString()),
  //         main = packageJSON.main
  //       if (main) {
  //         let s = path.join(p, main)
  //         if (!path.extname(s)) s += '.js'
  //         return s
  //       }
  //       return path.join(p, 'index.js')
  //     }
  //     catch (e) {
  //       return path.join(p, 'index.js')
  //     }
  //   }
  // }
  // catch (e) {
  //   if (!(depPath.startsWith('.') || depPath.startsWith('/'))) {
  //     if (dirname === path.dirname(path.resolve(dirname))) {
  //       return
  //     }
  //     return d(path.dirname(path.resolve(dirname)), depPath)
  //   }
  // }
}

module.exports = d
