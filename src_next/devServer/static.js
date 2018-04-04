// Dev server should spawned as child_process
const http = require('http')
const mock = require('mock-fs')
const nodeStatic = require('node-static')
const file = new nodeStatic.Server('', {cache: false})
const kill = require('kill-port')
const {log} = require('../utils/print')
const {port} = require('../config/global')
const mockConf = {}

;(async () => {
  mock(mockConf)
  process.on('message', message)

  await kill(port)
  log(`Server Listening at port ${port} ...`)

  http
    .createServer((request, response) => {
      log(`Request on ${request.url}`)
      request.on('data', () => {})
      request.on('end', () => {
        const writeHead = response.writeHead.bind(response)

        response.writeHead = function (...args) {
          // Disable Cache
          const headers = args[1]
          if (headers) {
            delete headers['Etag']
            delete headers['Last-Modified']
          }
          return writeHead(...args)
        }

        file.serve(request, response)
      })
    })
    .listen(port)
})()

function message (e) {
  switch (e.type) {
    case 'ADD':
      mockConf[e.path] = e.content.type === 'Buffer' ? Buffer.from(e.content.data) : e.content
      mock(mockConf)
      process.send({msgId: e.msgId})
      break
    case 'REMOVE':
      delete mockConf[e.path]
      mock(mockConf)
      process.send({msgId: e.msgId})
      break
    default:
      break
  }
}
