const babylon = require('babylon')
const babel = require('babel-core')
const generate = require('babel-generator').default
const traverse = require('babel-traverse').default
const configuration = require('../../config/babel')
const visitor = require('./visitor')
const {error} = require('../../utils/print')

module.exports = ({content, filename}, callback) => {
  let code
  let ast
  let compiled
  let dependencies = []

  if (/node_modules/.test(filename)) {
    ast = babylon.parse(content)
  } else {
    compiled = babel.transform(content, {
      filename,
      ...configuration
    }
    )
    ast = compiled.ast
  }
  traverse(ast, visitor((err, result) => {
    if (err) error(err)
    result && dependencies.push(result)
  }))

  code = generate(ast, {filename}).code

  const ret = {
    dependencies,
    ast,
    code
  }
  callback && callback(null, ret)
  return ret
}
