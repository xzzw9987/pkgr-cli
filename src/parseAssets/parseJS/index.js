const
  fs = require('fs'),
  path = require('path'),
  babylon = require('babylon'),
  babel = require('babel-core'),
  babelConf = require('../../config/babelConf'),
  traverse = require('./traverseJS'),
  makeModuleId = require('../../utils/makeModuleId'),
  resolve = require('../../utils/findModuleRealPath'),
  {log, error} = require('../../utils/print'),
  watch = require('../../utils/watch'),
  devServer = require('../../devServer')(),
  generateBundle = require('../../generateBundle')

module.exports = parse

function parse (filename, id, depsMap, processNextDep) {
  const
    {deps, findDep, entryId} = depsMap,
    content = fs.readFileSync(filename).toString(),
    moduleId = id,
    shouldHMRAdd = !deps[moduleId]

  let code, ast, compiled
  if (/node_modules/.test(filename)) {
    ast = babylon.parse(content)
    code = content
  }
  else {
    compiled = babel.transform(content, {
        filename,
        ...babelConf
      }
    )
    ast = compiled.ast
    code = compiled.code
  }
  deps[moduleId] = {
    type: 'js',
    id: moduleId,
    absolutePath: filename,
    deps: {},
    content,
    code
  }

  watch(entryId)(filename, (e, filename) => {
    try {
      if (e === 'update') {
        log(`Change detected: ${filename}`)
        parse(filename, id, depsMap, processNextDep)
        setTimeout(() => {
          devServer.hmrUpdate(`function(require,module,exports){${deps[moduleId].code}}`, deps[moduleId].absolutePath, deps[moduleId].deps, moduleId)
          // change bundle file content
          devServer.add(depsMap.filename, generateBundle(depsMap.deps))
        }, 100)
      }
    }
    catch (e) {
      error(e)
    }
  })

  traverse(ast, (err, result) => {
    if (err) {
      error(`${filename}: ${err}`)
      return
    }

    const
      depPath = result.value,
      depAbsolutePath = resolve(path.dirname(filename), depPath),
      depCached = findDep(depAbsolutePath)

    if (!depAbsolutePath)
      throw new Error(`Cannot find module ${depPath} in ${filename}`)

    if (!depCached) {
      const depModuleId = makeModuleId(entryId || 0)
      deps[moduleId].deps[depPath] = {id: depModuleId, path: depPath}
      processNextDep(depAbsolutePath, depModuleId)
    }
    else {
      const depModuleId = depCached.id
      deps[moduleId].deps[depPath] = {id: depModuleId, path: depPath}
    }
  })

  shouldHMRAdd && devServer.hmrAdd(`function(require,module,exports){${deps[moduleId].code}}`, deps[moduleId].absolutePath, deps[moduleId].deps, moduleId)
}