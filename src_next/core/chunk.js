class Chunk {
  constructor (initialModule) {
    this.id = initialModule.id

    this.modules = {}
    this.modulesByFilename = {}
  }

  addModule (module) {
    this.modules[module.id] = module
    this.modulesByFilename[module.filename] = module
  }

  isModuleExists (filename) {
    return !!this.modulesByFilename[filename]
  }
}

module.exports = Chunk