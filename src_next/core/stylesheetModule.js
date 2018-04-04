const path = require('path')
const url = require('url')
const fs = require('fs')
const Module = require('./module')
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const AssetBundler = require('../bundlers/asset')
const cssUrlMapper = require('postcss-url-mapper')
const md5 = require('../utils/md5')

class StylesheetModule extends Module {
  async parse (cssInJS = true/* Use this module in JS or <link />, JS default */) {
    // if (this._parsed) return
    this.cssInJS = cssInJS

    const {filename} = this
    const content = this._content = fs.readFileSync(filename).toString()
    // @todo postcss plugins
    const postcssPlugins = [
      autoprefixer,
      cssUrlMapper(map(filename))
    ]

    let css

    switch (path.extname(filename)) {
      case '.css':
        css =
          postcss(postcssPlugins)
            .process(content)
            .css
        break
      default:
        break
    }
    this._dependencies = []
    this._code = this.jsWrapper(this.id, css)
    this._parsed = true
  }

  jsWrapper (id, css) {
    if (!this.cssInJS) return css
    return `
        var styleID = 'pkgr-style-${id}'
        document.querySelector('#' + styleID) && document.head.removeChild(document.querySelector('#' + styleID))
         var style = document.createElement('style')
         style.id = styleID
         style.textContent = '${css.replace(/'/g, '\\\'').replace(/\n/g, '')}'
         document.head.appendChild(style)
    `
  }
}

function map (base) {
  const assetBundler = new AssetBundler()
  return src => {
    const p = url.resolve(base, src)
    try {
      const content = fs.readFileSync(p)
      const name = `${md5(content)}${path.extname(src)}`

      assetBundler.bundle(name, content)
      return AssetBundler.filename(name).src
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = StylesheetModule
