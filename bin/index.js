#!/usr/bin/env node

const
  path = require('path'),
  fs = require('fs'),
  chalk = require('chalk'),
  yargs = require('yargs'),
  cwd = process.cwd(),
  {error} = require('../src/utils/print'),
  start = require('../src/index'),
  init = require('../src/init'),
  builderOptions =
    yargs => yargs
      .option('config', {
        describe: 'Specify a config file',
        alias: 'c',
        default: 'pkgr.config.js',
        type: 'string'
      }),
  argv = yargs
    .usage('Packger-cli, The Most Awesome Bundle Tools. \nUsage <command> [options]')
    .command({
      command: 'build',
      desc: 'Build the bundle',
      builder: builderOptions,
      handler: argv => {
        try {
          const
            {config} = argv,
            conf = require(path.resolve(cwd, config))
          Object.defineProperty(conf, 'env', {value: 'production', enumerable: true})
          start(conf)
        }
        catch (e) {
          error(e.toString())
          process.exit()
        }
      }
    })
    .command({
      command: 'dev',
      desc: 'Start a dev server',
      builder: builderOptions,
      handler: argv => {
        try {
          const
            {config} = argv,
            conf = require(path.resolve(cwd, config))
          Object.defineProperty(conf, 'env', {value: 'development', enumerable: true})
          start(conf)
        }
        catch (e) {
          error(e.toString())
          process.exit()
        }
      }
    })
    .command({
      command: 'init',
      desc: 'Init a project',
      handler: argv => init()
    })
    .demandCommand()
    .help()
    .argv