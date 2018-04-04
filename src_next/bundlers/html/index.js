const fs = require('fs')
const path = require('path')
const conf = require('../../config/global')
const outputPath = conf.output.path
const ensure = require('../../utils/ensureDirectoryExistence')
const devServer = require('../../devServer')()

class Bundler {
  async bundle (filename, htmlString) {
    if (conf.env === 'production') { return this.bundleProd(filename, htmlString) }
    return this.bundleDev(filename, htmlString)
  }

  async bundleDev (filename, htmlString) {
    await devServer.add(filename, htmlString)
    return this.constructor.filename(filename)
  }

  async bundleProd (filename, htmlString) {
    const loc = this.constructor.filename(filename)
    const f = loc.src

    ensure(f)
    await fs.writeFileSync(
      f,
      htmlString
    )
    return loc
  }

  static filename (f) {
    if (conf.env === 'production') {
      return {
        src: path.join(outputPath, path.basename(f))
      }
    }
    return {
      src: path.join('/', path.basename(f))
    }
  }
}

module.exports = Bundler
