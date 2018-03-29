const
  babylon = require('babylon'),
  babel = require('babel-core'),
  traverse = require('babel-traverse').default,
  configuration = require('../../config/babel'),
  visitor = require('./visitor')

module.exports = ({content, filename}) => {
  let code, ast, compiled, dependencies = []
  if (/node_modules/.test(filename)) {
    ast = babylon.parse(content)
    code = content
  }
  else {
    compiled = babel.transform(content, {
        filename,
        ...configuration
      }
    )
    ast = compiled.ast
    code = compiled.code
  }

  traverse(ast, visitor((err, result) => result && dependencies.push(result)))
  return {
    dependencies,
    ast,
    code
  }
}