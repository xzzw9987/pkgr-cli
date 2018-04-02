const
  parseJS = require('./analyst/javascript'),
  fs = require('fs'),
  path = require('path'),
  resolve = require('resolve')

//  workerFarm = require('node-worker-farm'),
//  workers = workerFarm(require.resolve('./analyst/javascript'))

// const parseJS = v => {
//   return new Promise(resolve => {
//     workers(v, (err, output) => {
//       // console.log(typeof output, 111)
//       resolve(output)
//     })
//   })
// }

class Module {
  constructor (filename, id) {
    this.filename = filename
    this.id = id

    this._dependencies = null
    this._code = null
    this._ast = null
    this._content = null

    this.type = path.extname('.js')
    this._parsed = false
  }

  async parse () {
    if (this._parsed) return
    const
      {filename} = this,
      content = fs.readFileSync(filename).toString()

    this._content = content

    switch (path.extname(filename)) {
      case '.js':
        const {dependencies = [], ast, code} = parseJS({content, filename})
        this._dependencies = dependencies.map(
          d => Object.assign(
            {},
            d,
            {filename: resolve.sync(d.value, {basedir: path.dirname(filename)})}
          )
        )
        this._ast = ast
        this._code = code
    }
    this._parsed = true
  }

  get dependencies () {
    // if (null === this._dependencies) this.parse()
    return this._dependencies
  }

  get content () {
    // if (null === this._content) this.parse()
    return this._content
  }

  get ast () {
    // if ('.js' === this.type && null === this._ast) this.parse()
    return this._ast
  }

  get code () {
    // if (null === this._code) this.parse()
    return this._code
  }

}

module.exports = Module