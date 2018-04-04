const fs = require('fs')
const path = require('path')

let json = {}
try {
  json = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.babelrc')).toString())
} catch (e) {}

module.exports = json
