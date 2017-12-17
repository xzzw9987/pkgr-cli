/**
 * it's a template
 */
module.exports = function (deps, entries) {
  var caches = {}

  function makeRequire (id) {
    var requiredArgs = deps[id][1]
    return function (depPath) {
      return requireById(requiredArgs[depPath])
    }
  }

  function requireById (moduleId) {
    if (caches[moduleId]) {
      return caches[moduleId]
    }
    caches[moduleId] = {}
    var module = {}
    deps[moduleId][0](makeRequire(moduleId), module, caches[moduleId])
    if (module.exports) caches[moduleId] = module.exports
    return caches[moduleId]
  }

  entries.forEach(function (moduleId) {
    deps[moduleId][0](requireById, {}, {})
  })
}
