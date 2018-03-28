const
  Chunk = require('./chunk'),
  Module = require('./module')

class Entry {
  constructor (entryId) {
    this.entryId = entryId
    this.chunks = {}

    this.modules = {}
    this.modulesByFilename = {}

    this.moduleId = 1
  }

  _makeModuleId () {
    return this.moduleId++
  }

  addChunk (chunk) {
    this.chunks[chunk.id] = chunk
  }

  addModule (module) {
    this.modules[module.id] = module
  }

  instChunk (initialModule) {
    if (this.chunks[initialModule.id]) return this.chunks[initialModule.id]
    return new Chunk(initialModule)
  }

  instModule (filename) {
    if (this.modulesByFilename[filename]) return this.modulesByFilename[filename]
    return new Module(filename, this._makeModuleId())
  }

  isModuleExists (filename) {

  }
}

module.exports = Entry