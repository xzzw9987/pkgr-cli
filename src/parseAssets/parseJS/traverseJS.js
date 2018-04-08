const
  traverse = require('babel-traverse').default,
  getVisitor = require('./visitor')

module.exports = (ast, callback) => {
  traverse(ast, getVisitor(callback))
}
