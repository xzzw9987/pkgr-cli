const w = require('ws')
const kill = require('kill-port')
const {error} = require('../utils/print')
const {hmrPort: port} = require('../config/global')

;(async () => {
  await kill(port)

  const server = new w.Server({port})
  server.on('error', e => error(e))
  process.on('message', message)

  function message (e) {
    switch (e.type) {
      case 'UPDATE':
        broadcast(
          [{
            type: 'UPDATE',
            code: e.code,
            deps: e.deps,
            absolutePath: e.absolutePath,
            moduleId: e.moduleId
          }]
        )
        break
      case 'ADD':
        broadcast(
          [{
            type: 'ADD',
            code: e.code,
            deps: e.deps,
            absolutePath: e.absolutePath,
            moduleId: e.moduleId
          }]
        )
        break
      case 'TAG':
        broadcast(
          [{
            type: 'TAG',
            tagId: e.tagId
          }]
        )
        break
      default:
        break
    }
  }

  function broadcast (message) {
    server.clients.forEach(client =>
      client.readyState === w.OPEN &&
      client.send(typeof message === 'string' ? message : JSON.stringify(message)))
  }
})()
