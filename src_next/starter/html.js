const
  url = require('url'),
  fs = require('fs'),
  parse5 = require('parse5'),
  htmlUtils = require('parse5-utils'),
  openurl = require('openurl'),
  conf = require('../config/global'),
  jsEntry = require('./script'),
  {error} = require('../utils/print'),
  TemplateBundler = require('../bundlers/html')

module.exports = async filename => {

  try {
    fs.statSync(filename)
  }
  catch (e) {
    console.error(`Can't find file: ${filename}`)
    return
  }

  const
    document = parse5.parse(fs.readFileSync(filename).toString()),
    bundler = new TemplateBundler

  await traverse(document)
  await bundler.bundle(filename, parse5.serialize(document))

  async function traverse (node) {
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

          const {src} = await jsEntry(url.resolve(filename, value))
          src && (attr.value = src[0])
        }
        break
      // case 'link':
      //   const
      //     rel = getAttr(node, 'rel'),
      //     href = getAttr(node, 'href')
      //   if (/^\/\/|^https?:\/\//.test(href.value)) break
      //
      //   if (rel && rel.value === 'stylesheet' && href) {
      //     const {name, hash} = cssEntry(url.resolve(filename, href.value))
      //     href.value = name
      //     htmlUtils.setAttribute(node, 'id', `link-${hash}`)
      //   }
      //
      //   break
      default:
        break
    }

    if (node.childNodes) await Promise.all(node.childNodes.map(traverse))
  }
}

function getAttr (node, name) {
  const attrs = node.attrs.filter(attr => name === attr.name)
  if (attrs[0]) return attrs[0]
}