#!/usr/bin/env node

const path = require('path')
const yargs = require('yargs')
const cwd = process.cwd()
const {error} = require('../src/utils/print')
const start = require('../src_next/index')
const init = require('../src/init')
const builderOptions = yargs =>
  yargs.option('config', {
    describe: 'Specify a config file',
    alias: 'c',
    default: 'pkgr.config.js',
    type: 'string'
  })

/* eslint-disable no-unused-expressions */
yargs
  .usage(
    'Packger-cli, The Most Awesome Bundle Tools. \nUsage <command> [options]'
  )
  .command({
    command: 'build',
    desc: 'Build the bundle',
    builder: builderOptions,
    handler: argv => {
      try {
        const {config} = argv
        const conf = require(path.resolve(cwd, config))
        Object.defineProperty(conf, 'env', {
          value: 'production',
          enumerable: true
        })
        start(conf)
      } catch (e) {
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
      // try {
      const {config} = argv
      const conf = require(path.resolve(cwd, config))
      Object.defineProperty(conf, 'env', {
        value: 'development',
        enumerable: true
      })
      start(conf)
      // }
      // catch (e) {
      //   error(e.toString())
      // process.exit()
      // }
    }
  })
  .command({
    command: 'init',
    desc: 'Init a project',
    handler: argv => init()
  })
  .demandCommand()
  .help().argv
