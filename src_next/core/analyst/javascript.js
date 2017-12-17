const
  babylon = require('babylon'),
  babel = require('babel-core'),
  generate = require('babel-generator').default,
  traverse = require('babel-traverse').default,
  configuration = require('../../config/babel'),
  visitor = require('./visitor')

module.exports = ({content, filename}, callback) => {
  let code, ast, compiled, dependencies = []
  if (/node_modules/.test(filename)) {
    ast = babylon.parse(content)
  }
  else {
    compiled = babel.transform(content, {
        filename,
        ...configuration
      }
    )
    ast = compiled.ast
  }
  traverse(ast, visitor((err, result) => result && dependencies.push(result)))

  code = generate(ast, {filename}).code

  const ret = {
    dependencies,
    ast,
    code
  }
  callback && callback(null, ret)
  return ret
}