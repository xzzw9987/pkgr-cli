const conf = require('../config/globalConf')
module.exports = depsMap => {
  return `function (r, tools) {
  var global = (1, eval)('this')
  global.process = {env: {'NODE_ENV': '${conf.env}'}}
  r(1)
  
  ${conf.env === 'production' ? `}`: `var socket = new WebSocket('ws://localhost:12321')
  socket.addEventListener('open', function() {
      console.log('[HMR Server] Connected')
  })
  socket.addEventListener('message', function(e) {
      console.log('[HMR Server] Receive Update Command')
      if (!tools) return
      var data = JSON.parse(e.data)
      // data === []
      data.forEach(function(change) {

          if (change.type === 'ADD') {
              var func = eval('(' + change.code + ')'),
                  i = change.moduleId,
                  p = change.absolutePath,
                  d = change.deps

              tools.deps[i] = [func, Object.keys(d).reduce(function(p, n) {
                  p[n] = d[n].id
                  return p
              }, {})]
          }



          if (change.type === 'UPDATE') {
              var func = eval('(' + change.code + ')'),
                  d = change.deps,
                  p = change.absolutePath,
                  i = change.moduleId

              tools.deps[i] = [func, Object.keys(d).reduce(function(p, n) {
                  p[n] = d[n].id
                  return p
              }, {})]
              hmr(i)

          }

      })
  })


  function hmr(id) {
      if (!tools) return
      var cache = tools.caches[id]
      cache && cache._disposeCallback && cache._disposeCallback()
      delete tools.caches[id]
      r(id)
      if(cache && cache._acceptCallback) {
          cache._acceptCallback()      
          return true
      }
      
      var parents = []
      for (var i in tools.deps) {
          var deps = tools.deps[i][1] || {}
          Object.keys(deps).forEach(function(k) {
              if (+id === +deps[k]) {
                parents.push(i)
              }
          })
      }
      return parents.some(function(id) {
        return hmr(id)
      })
  }
}`}`
}