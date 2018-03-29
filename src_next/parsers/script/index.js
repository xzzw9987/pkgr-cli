module.exports = async ({filename, entry, chunk, nextCall}) => {
  if (chunk && chunk.isModuleExists(filename)) return

  const m/*odule*/ = entry.instModuleIfNeeded(filename)
  if (!chunk) {
    chunk = entry.instChunkIfNeeded(m)
    entry.addChunk(chunk)
  }

  chunk.addModule(m)

  if (!entry.isModuleExists(filename)) {
    entry.addModule(m)
    await m.parse()
    const {dependencies} = m
    dependencies.forEach(({value: depPath, filename, async}) => {
      nextCall({
        filename,
        chunk: async ? undefined : chunk,
        entry
      })
    })
  }
}