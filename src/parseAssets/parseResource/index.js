const
  fs = require('fs'),
  path = require('path'),
  watch = require('../../utils/watch'),
  {log, error} = require('../../utils/print'),
  devServer = require('../../devServer')(),
  generateBundle = require('../../generateBundle'),
  conf = require('../../config/globalConf'),
  saveBundle = require('../../utils/saveBundle'),
  md5 = require('../../utils/md5'),
  bundlePath = require('../../utils/bundlePath')

module.exports = parse

function parse (filename, id, depsMap, processNextDep) {
  const
    {deps, entryId} = depsMap,
    content = fs.readFileSync(filename),
    moduleId = id,
    shouldHMRAdd = !deps[moduleId],
    url = `${md5(content)}${path.extname(filename)}`

  deps[moduleId] = {
    type: 'resource',
    id: moduleId,
    absolutePath: filename,
    deps: {},
    content: '',
    code: genJSCode(path.join('../', bundlePath(url).relative))
  }

  conf.env === 'production' ? saveBundle(url, content) : devServer.add(url, content)

  watch(entryId)(filename, (e, filename) => {
    try {
      if (e === 'update') {
        log('change', e, filename)
        parse(filename, id, depsMap, processNextDep)
        devServer.hmrUpdate(`function(require,module,exports){${deps[moduleId].code}}`, deps[moduleId].absolutePath, deps[moduleId].deps, moduleId)

        // change bundle file content
        devServer.add(depsMap.filename, generateBundle(depsMap.deps))
      }
    }
    catch (e) {
      error(e)
    }
  })

  shouldHMRAdd && devServer.hmrAdd(`function(require,module,exports){${deps[moduleId].code}}`, deps[moduleId].absolutePath, deps[moduleId].deps, moduleId)

}

function genJSCode (url) {
  return `
    module.exports = '${url.replace(/'/g, '\\')}'
  `
}


