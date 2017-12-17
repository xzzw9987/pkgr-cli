const t = require('babel-types')

/**
 * Accept file string, and push it to map
 * @params callback
 */
function parseRequireDeps (callback) {
  return {
    CallExpression (path) {
      const {name} = path.node.callee,
        {bindings} = path.scope
      if (name === 'require' && !('require' in bindings)) {
        // Valid require
        const arg = path.node.arguments[0]
        if (!t.isStringLiteral(arg)) {
          callback(new Error(`Params passed to require should be string literal at line: ${path.node.loc.start.line}`), null)
          return
        }
        callback(null, {value: arg.value})
      }
    }
  }
}

function parseES6Deps (fileContent, dependenciesMap) {

}

function parseDeps (...args) {
  return parseRequireDeps(...args)
}

module.exports = parseDeps