const
  path = require('path'),
  conf = require('../config/global')

let
  server,
  hmrServer

module.exports = () => {
  if (!server && conf.env !== 'production') server = require('child_process').fork(path.join(__dirname, `static.js`))
  // if (!hmrServer && conf.env !== 'production') hmrServer = require('child_process').fork(path.join(__dirname, `hmr.js`))
  return conf.env === 'production'
    ? {add: noop, remove: noop, hmrUpdateTag: noop, hmrUpdate: noop, hmrAdd: noop}
    : {
      add: (path, content) => {
        server.send({
          type: 'ADD',
          path, content
        })
      },
      remove: path => {
        server.send({
          type: 'REMOVE',
          path
        })
      },
      hmrUpdateTag: (tagId) => {
        hmrServer.send({
          type: 'TAG',
          tagId
        })
      },
      hmrUpdate: (code, absolutePath, deps, moduleId) => {
        hmrServer.send({
          type: 'UPDATE',
          code,
          absolutePath,
          deps,
          moduleId
        })
      },
      hmrAdd: (code, absolutePath, deps, moduleId) => {
        hmrServer.send({
          type: 'ADD',
          code,
          absolutePath,
          deps,
          moduleId
        })
      }
    }
}

function noop () {}

function registerConfirmCallback (confirmCallback) {
  const
    cid = random(),
    cb = val => {
      cid === val.id && server.removeListener('message', cb)
      cid === val.id && confirmCallback && confirmCallback()
    }
  // server.on('message', cb)
  return cid
}

function random () {
  return `${(new Date).getTime()}_${parseInt(Math.random() * 10e7, 10)}`
}

