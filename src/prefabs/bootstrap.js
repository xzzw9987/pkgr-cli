/**
 * it's a template
 */
module.exports = depsMap => {
  return `function (deps, entries) {
  var caches = {}
  function makeRequire (id) {
    var requiredArgs = deps[id][1]
    return function (depPath) {
      return requireById(requiredArgs[depPath])
    }
  }

  function requireById (moduleId) {
    if (caches[moduleId]) {
      return caches[moduleId].exports
    }
    var exports = {}
    var module = caches[moduleId] = {
      exports: exports,
      hot: {
        accept: function(callback) {
            caches[moduleId]._acceptCallback = callback || function() {}
        },
        dispose: function(callback) {
            caches[moduleId]._disposeCallback = callback
        }
      }
    }
    
    deps[moduleId][0](makeRequire(moduleId), module, exports)
    // if (module.exports !== exports) caches[moduleId].exports = module.exports
    return caches[moduleId].exports
  }

  entries.forEach(function (moduleId) {
    deps[moduleId][0](requireById, {
      makeRequire: makeRequire, 
      caches: caches, /* caches message */ 
      deps: deps /* modules func */
    })
  })
}`
}
