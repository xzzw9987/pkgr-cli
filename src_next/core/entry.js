const
  path = require('path'),
  EventEmitter = require('events'),
  watch = require('node-watch'),
  Chunk = require('./chunk'),
  Module = require('./module'),
  StylesheetModule = require('./stylesheetModule')

class Entry extends EventEmitter {
  constructor (entryId) {
    super()

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
    this.watch(module)
  }

  instChunkIfNeeded (initialModule) {
    if (this.chunks[initialModule.id]) return this.chunks[initialModule.id]
    return new Chunk(initialModule)
  }

  instModuleIfNeeded (filename) {
    if (this.modulesByFilename[filename]) return this.modulesByFilename[filename]
    return createModule(filename, this._makeModuleId())
  }

  isModuleExists (filename) {
    return !!this.modulesByFilename[filename]
  }

  watch (module) {
    watch(module.filename, (evt, filename) => {
      evt === 'update' && this.emit(evt, filename)
    })
  }

  subscribe (evt, callback) {
    if (!this.eventQueue) {
      this.eventQueue = {}
    }

    if (!this.eventQueue[evt]) {
      this.eventQueue[evt] = []
      this.on(evt, (...args) => this.eventQueue[evt].forEach(callback => callback(...args)))
    }

    this.eventQueue.push(callback)
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
