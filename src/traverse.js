const
  traverse = require('babel-traverse').default,
  getRequireDeps = require('./getRequireDeps')

module.exports = (ast, callback) => {
  traverse(ast, getRequireDeps(callback))
}