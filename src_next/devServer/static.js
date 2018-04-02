// Dev server should spawned as child_process
const
  http = require('http'),
  mock = require('mock-fs'),
  nodeStatic = require('node-static'),
  file = new nodeStatic.Server('', {cache: false}),
  kill = require('kill-port'),
  {log, error} = require('../utils/print'),
  {port} = require('../config/global'),
  mockConf = {}

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
      process.send({id: e.messageID})
      break
    case 'REMOVE':
      delete mockConf[e.path]
      mock(mockConf)
      process.send({id: e.messageID})
      break
    default:
      break
  }
}