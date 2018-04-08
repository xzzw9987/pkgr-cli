module.exports = () => {
  const deps = {}
  return {
    /* filename: entry chunk filename */
    deps,
    findDep: absolutePath => {
      let ret
      for (let moduleId in deps) {
        if (deps[moduleId].absolutePath === absolutePath) {
          ret = deps[moduleId]
          break
        }
      }
      return ret
    }
  }
}

/**
 Shape of deps:
 moduleId: {
 id: moduleId,
 absolutePath: resolvedPath,
 deps: {},
 content: fileContent,
 code: processCode
 }

 deps.deps
 {
     path: {id: depModuleId, path: depPath}
 }
 */
