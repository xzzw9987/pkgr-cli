const parseJS = require('./analyst/javascript')

class Module {
  constructor (filename, id) {
    this.filename = filename
    this.id = id

    this._dependecies = null
    this._content = null
  }

  parse () {
    const
      {id, filename} = this,
      content = fs.readFileSync(filename).toString()

    this._content = content

    switch (filename) {
      case 'js':
    }
  }

  get dependecies () {
    if (null === this._dependecies) this.parse()
    return this._dependecies
  }

  get content () {
    if (null === this._content) this.parse()
    return this._content
  }
}

module.exports = Module