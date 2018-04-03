const crypto = require('crypto')
module.exports = function md5 (content) {
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 8)
}