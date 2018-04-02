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
    return await devServer.add(filename, htmlString)
  }

  async bundleProd (filename, htmlString) {
    const f = path.join(outputPath, path.basename(filename))
    ensure(f)
    await fs.writeFileSync(
      f,
      htmlString
    )
  }
}

module.exports = Bundler