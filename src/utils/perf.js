const {log} = require('../utils/print')
module.exports = () => {
  const beginTime  = +(new Date)
  return {
    end () { log(`Time elapsed: ${+(new Date) - beginTime}ms`) }
  }
}