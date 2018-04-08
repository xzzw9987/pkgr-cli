const path = require('path')
module.exports = {
  output: {
    path: path.resolve(process.cwd(), 'dist')
  },
  hmrPort: 12321,
  port: 5000
}
