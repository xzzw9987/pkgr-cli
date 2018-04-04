const
  chalk = require('chalk'),
  log = console.log

exports.error = msg => log(chalk.bold.red(msg))

exports.warn = msg => log(chalk.bold.orange(msg))

exports.log = msg => log(chalk.bold.green(msg))
