const w = require('ws'),
  kill = require('kill-port'),
  {error} = require('../utils/print'),
  {hmrPort: port} = require('../config/globalConf')

kill(port)
  .then(() => {
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
        client.readyState === w.OPEN
        && client.send(typeof message === 'string' ? message : JSON.stringify(message)))
    }
  })