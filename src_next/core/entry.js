const
  path = require('path'),
  Chunk = require('./chunk'),
  Module = require('./module'),
  StylesheetModule = require('./stylesheetModule')

class Entry {
  constructor (entryId) {
    this.entryId = entryId
    this.chunks = {}
    this.modules = {}
    this.modulesByFilename = {}

    this._moduleId = 1
  }

  _makeModuleId () {
    return this._moduleId++
  }

  addChunk (chunk) {
    this.chunks[chunk.id] = chunk
  }

  addModule (module) {
    this.modules[module.id] = module
    this.modulesByFilename[module.filename] = module
  }

  instChunkIfNeeded (initialModule) {
    if (this.chunks[initialModule.id]) return this.chunks[initialModule.id]
    return new Chunk(initialModule)
  }

  instModuleIfNeeded (filename) {
    if (this.modulesByFilename[filename]) return this.modulesByFilename[filename]
    return new createModule(filename, this._makeModuleId())
  }

  isModuleExists (filename) {
    return !!this.modulesByFilename[filename]
  }
}

module.exports = Entry

function createModule (filename, id) {
  const types = {
    '.js': Module,
    '.jsx': Module,
    '.css': StylesheetModule,
  }
  return new (types[path.extname(filename)] || Module)(filename, id)
}
