const
  fs = require('fs'),
  path = require('path'),
  postcss = require('postcss'),
  autoprefixer = require('autoprefixer'),
  cssModule = require('postcss-modules-sync').default,
  watch = require('../../utils/watch'),
  {log, error} = require('../../utils/print'),
  devServer = require('../../devServer')(),
  generateBundle = require('../../generateBundle'),
  md5 = require('../../utils/md5'),
  bundlePath = require('../../utils/bundlePath'),
  saveBundle = require('../../utils/saveBundle'),
  conf = require('../../config/globalConf'),
  cssUrlMapper = require('postcss-url-mapper'),
  url = require('url')

module.exports = parse

function parse (filename, id, depsMap, processNextDep) {
  const
    {deps, entryId} = depsMap,
    content = fs.readFileSync(filename).toString(),
    moduleId = id,
    shouldHMRAdd = !deps[moduleId]

  const
    name = `${parseInt(1000 * Math.random(), 10)}.css`,
    assets = new Set()

  let
    cssModuleJSON,
    postcssPlugins = []

  postcssPlugins.push(autoprefixer)
  conf.cssModule && postcssPlugins.push(cssModule({
    getJSON: tokens => cssModuleJSON = tokens
  }))
  postcssPlugins.push(cssUrlMapper(map(filename, assets)))

  const
    css = postcss(postcssPlugins)
      .process(content, {from: filename, to: `/${name}`})
      .css,
    code = cssCodeInJS(css, moduleId, cssModuleJSON)

  deps[moduleId] = {
    type: 'css',
    id: moduleId,
    absolutePath: filename,
    deps: {},
    content: css,
    code,
  }

  for (let assetInfo of assets) {
    conf.env === 'production'
      ? saveBundle(assetInfo.name, assetInfo.content)
      : devServer.add(assetInfo.name, assetInfo.content)
  }

  watch(entryId)(filename, (e, filename) => {
    try {
      if (e === 'update') {
        log(`Change Detected: \n${filename}`)
        parse(filename, id, depsMap, processNextDep)
        setTimeout(() => {

          if (moduleId < 0) {
            devServer.hmrUpdateTag(path.basename(depsMap.filename, '.css'))
            devServer.add(depsMap.filename, deps[moduleId].content)
          }

          else {
            devServer.hmrUpdate(`function(require,module,exports){${deps[moduleId].code}}`, deps[moduleId].absolutePath, deps[moduleId].deps, moduleId)
            // change bundle file content
            devServer.add(depsMap.filename, generateBundle(depsMap.deps))
          }
        }, 100)
      }
    }
    catch (e) {
      error(e)
    }
  })

  shouldHMRAdd && devServer.hmrAdd(`function(require,module,exports){${deps[moduleId].code}}`, deps[moduleId].absolutePath, deps[moduleId].deps, moduleId)
}

function cssCodeInJS (code, id, json) {
  return `
    var styleID = 'pkgr-style-${id}'
    document.querySelector('#' + styleID) && document.head.removeChild(document.querySelector('#' + styleID))
    
    var style = document.createElement('style')
    style.id = styleID
    style.textContent = '${code.replace(/'/g, '\\\'').replace(/\n/g, '')}'
    document.head.appendChild(style)
    ${json ? `module.exports = ${JSON.stringify(json)}` : ''}
  `
}

function map (base, assets = new Set()) {
  return (src, type) => {
    const p = url.resolve(base, src)
    try {
      const
        content = fs.readFileSync(p),
        name = `${md5(content)}${path.extname(src)}`

      assets.add({
        name,
        content
      })

      return conf.env === 'production' ? path.join('../', bundlePath(name).relative) : name
    }
    catch (e) {
      error(e)
      return p
    }

  }
}