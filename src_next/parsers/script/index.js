const EventTypes = require('../../utils/eventTypes')

const parse = async ({filename, entry, chunk, bundler, nextCall, updatedModule}) => {
  if (updatedModule /* force update */) {
    await parseModule(updatedModule)
    return
  }

  if (chunk && chunk.isModuleExists(filename)) return

  const m/*odule*/ = entry.instModuleIfNeeded(filename)
  if (!chunk) {
    chunk = entry.instChunkIfNeeded(m)
    entry.addChunk(chunk)
  }

  chunk.addModule(m)
  if (!entry.isModuleExists(filename)) {
    entry.addModule(m)
    await parseModule(m)

    entry.subscribe('update', async __filename => {
      if (__filename !== filename) return
      await parse({
        filename,
        entry,
        chunk,
        bundler,
        updatedModule: m, /*force update*/
        nextCall
      })
      entry.emit(EventTypes.MODULE_UPDATE)
    })
  }
  else {
    const {dependencies} = m
    await Promise.all(dependencies.map(({value: depPath, filename, async}) =>
      nextCall({
        filename,
        entry,
        chunk: async ? undefined : chunk,
        bundler
      })
    ))
  }

  async function parseModule (m/*odule*/) {
    await m.parse()
    const {dependencies} = m
    await Promise.all(dependencies.map(({value: depPath, filename, async}) =>
      nextCall({
        filename,
        entry,
        chunk: async ? undefined : chunk,
        bundler
      })
    ))
  }
}

module.exports = parse