let h = {}
module.exports = (entryId = 0) => {
  if (undefined === h[entryId]) h[entryId] = 0
  return ++h[entryId]
}
