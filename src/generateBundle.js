const
  bootstrap = require('./prefabs/bootstrap').toString()
  parseJS = require('./processAssets/parseJS')

module.exports = depsMap => {
  const bundle = []
  for (var key in depsMap) {
    bundle[depsMap[key].id] = parseJS(depsMap[key].content, depsMap[key].deps)
  }
  return `;(${bootstrap})([[function(r){r(1)/*@todo*/}]${bundle.join()}],[0])`
}