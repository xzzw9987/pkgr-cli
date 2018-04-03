const
  fs = require('fs'),
  path = require('path'),
  conf = require('../../config/global'),
  outputPath = conf.output.path,
  ensure = require('../../utils/ensureDirectoryExistence'),
  devServer = require('../../devServer')()

class Bundler {

  async bundle (filename, htmlString) {
    if (conf.env === 'production')
      return await this.bundleProd(filename, htmlString)
    return await this.bundleDev(filename, htmlString)
  }

  async bundleDev (filename, htmlString) {
    await devServer.add(filename, htmlString)
    return this.constructor.filename(filename)
  }

  async bundleProd (filename, htmlString) {
    const
      loc = this.constructor.filename(filename),
      f = loc.src

    ensure(f)
    await fs.writeFileSync(
      f,
      htmlString
    )
    return loc
  }

  static filename (f) {
    if (conf.env === 'production')
      return {
        src: path.join(outputPath, path.basename(f))
      }
    return {
      src: path.join('/', path.basename(f))
    }
  }

}

module.exports = Bundler