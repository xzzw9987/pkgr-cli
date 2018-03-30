const
  url = require('url'),
  path = require('path'),
  fs = require('fs'),
  parse5 = require('parse5'),
  htmlUtils = require('parse5-utils'),
  openurl = require('openurl'),
  conf = require('../config/global'),
  {error} = require('../utils/print')

let entryID = 0

module.exports = filename => {

  try {
    fs.statSync(filename)
  }
  catch (e) {
    console.error(`Can't find file: ${filename}`)
    return
  }

  const document = parse5.parse(fs.readFileSync(filename).toString())
  traverse(document)

  function traverse (node) {
    switch (node.tagName) {
      // case 'head':
      //   if (conf.env === 'production') break
      //   const clientScript = htmlUtils.createNode('script')
      //   htmlUtils.setText(clientScript, clientJS())
      //   htmlUtils.append(node, clientScript)
      //   break
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