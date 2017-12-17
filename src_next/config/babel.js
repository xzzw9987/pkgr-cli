const
  fs = require('fs'),
  path = require('path')

let json = {}
try {
  json = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.babelrc')).toString())
}
catch (e) {}

module.exports = json
