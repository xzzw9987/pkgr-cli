const
  url = require('url'),
  path = require('path'),
  fs = require('fs'),
  parse5 = require('parse5'),
  htmlUtils = require('parse5-utils'),
  openurl = require('openurl'),
  jsEntry = require('./jsEntry'),
  cssEntry = require('./cssEntry'),
  timePerf = require('../utils/perf'),
  startDevServer = require('../devServer'),
  clientJS = require('../prefabs/client'),
  conf = require('../config/globalConf')

module.exports = function htmlEntry (filename) {
  try {
    fs.statSync(filename)
  } catch (e) {
    // @todo
    // Show an explicit error
    console.error(`Can't find file: ${filename}`)
    return
  }

  const
    perf = timePerf(),
    document = parse5.parse(fs.readFileSync(filename).toString()),
    devServer = startDevServer()

  traverse(document)
  conf.env === 'production'
    ? fs.writeFileSync(path.resolve(conf.output.path, path.basename(filename)), parse5.serialize(document))
    : devServer.add(path.basename(filename), parse5.serialize(document))
  perf.end()

  conf.env !== 'production' && openurl.open(`http://localhost:${conf.port}/${path.basename(filename)}`)

  function traverse (node) {
    switch (node.tagName) {
      case 'head':
        if (conf.env === 'production') break
        const clientScript = htmlUtils.createNode('script')
        htmlUtils.setText(clientScript, clientJS())
        htmlUtils.append(node, clientScript)
        break
      case 'script':
        const attr = getAttr(node, 'src')
        if (attr) {
          const {value} = attr
          if (/^\/\/|^https?:\/\//.test(value)) break

          const {name} = jsEntry(url.resolve(filename, value))
          attr.value = name
        }
        break
      case 'link':
        const
          rel = getAttr(node, 'rel'),
          href = getAttr(node, 'href')
        if (/^\/\/|^https?:\/\//.test(href.value)) break

        if (rel && rel.value === 'stylesheet' && href) {
          const {name, hash} = cssEntry(url.resolve(filename, href.value))
          href.value = name
          htmlUtils.setAttribute(node, 'id', `link-${hash}`)
        }

        break
      default:
        break
    }

    node.childNodes && node.childNodes.forEach(traverse)
  }
}

function getAttr (node, name) {
  const attrs = node.attrs.filter(attr => name === attr.name)
  if (attrs[0]) return attrs[0]
}
