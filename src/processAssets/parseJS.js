function parse (content, deps) {
  const
    wrapped = `function(require,module,exports){${content}}`,
    s = Object.keys(deps)
      .reduce((prev, now) => {
        prev[now] = deps[now].id
        return prev
      }, {})

  return `[${wrapped},${JSON.stringify(s)}]`
}

module.exports = parse