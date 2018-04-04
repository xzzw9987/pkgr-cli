const path = require('path')
const conf = require('../config/global')

let server
let hmrServer

module.exports = () => {
  if (!server && conf.env !== 'production') {
    server = require('child_process').fork(path.join(__dirname, `static.js`))
    const msgQueue = {}
    server.sendMessage = function (obj, callback) {
      if (callback) {
        const id = random()
        msgQueue[id] = callback
        obj = Object.assign({}, obj, {msgId: id})
      }
      this.send(obj)
    }

    server.on('message', o => {
      const {msgId} = o
      msgQueue[msgId] && msgQueue[msgId](o)
      delete msgQueue[msgId]
    })
  }

  // if (!hmrServer && conf.env !== 'production') hmrServer = require('child_process').fork(path.join(__dirname, `hmr.js`))
  return conf.env === 'production'
    ? {add: noop, remove: noop, hmrUpdateTag: noop, hmrUpdate: noop, hmrAdd: noop}
    : {
      add: (path, content) =>
        new Promise(resolve =>
          server.sendMessage({
            type: 'ADD',
            path,
            content
          }, resolve)),
      remove: path =>
        new Promise(resolve =>
          server.sendMessage({
            type: 'REMOVE',
            path
          }, resolve)),
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

function random () {
  return `${(new Date()).getTime()}_${parseInt(Math.random() * 10e7, 10)}`
}
