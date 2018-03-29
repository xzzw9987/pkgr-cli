const t = require('babel-types')

/**
 * Accept file string, and push it to map
 * @params callback
 */
module.exports = function (callback) {
  return {
    CallExpression (path) {
      const
        {name} = path.node.callee,
        {bindings} = path.scope
      if (
        (name === 'require' && !('require' in bindings)) ||
        (path.node.callee.type.toLowerCase() === 'import' && !('import' in bindings))) {
        // Valid require
        const arg = path.node.arguments[0]
        if (!t.isStringLiteral(arg)) {
          callback(new Error(`Params passed to require should be string literal at line: ${path.node.loc.start.line}`), null)
          return
        }
        callback(null, {value: arg.value, async: !(name === 'require')})
      }

    }
  }
}
