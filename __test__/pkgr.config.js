const path = require('path')
module.exports = {
  entry: path.resolve(__dirname, 'index.html'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    // publicPath: 'http://example.com/'
  },
  cssModule: true
}