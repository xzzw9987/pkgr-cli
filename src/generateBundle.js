const
  bootstrap = require('./prefabs/bootstrap'),
  module0 = require('./prefabs/module0'),
  bundleJS = require('./bundleAssets/bundleJS'),
  uglify = require('uglify-js'),
  conf = require('./config/globalConf')

module.exports = depsMap => {
  const bundle = []
  for (var key in depsMap) {
    bundle[depsMap[key].id] = bundleJS(depsMap[key].code, depsMap[key].deps)
  }
  let code = `;(${bootstrap(depsMap)})([[${module0(depsMap)}]${bundle.join()}],[0])`
  if (conf.env === 'production') {
    const result = uglify.minify(code)
    if (result.error) throw result.error
    code = result.code
  }
  return code
}