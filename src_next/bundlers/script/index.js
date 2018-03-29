class Bundler {
  constructor (entry) {
    this._entry = entry
    this._code = null
    this._chunkCode = []
  }

  bundle () {

  }
}

function bootstrap (additionalCode) {
  return `
    ;(function(global){
      var modules = {}, caches = {}
      
      function makeRequire(id) {
        if(!modules[id]) throw new Error(id + ': not found')
        var dependencies = modules[id][1]
        return function(path) {
          var id = dependencies[path].id
          return requireById(dependencies[path].id)
        }
      }
      
      function makeAsyncRequire(id) {
        if(!modules[id]) throw new Error(id + ': not found')
        var dependencies = modules[id][1]
        return function(path) {
          
           return new Promise(resolve => {
               var id = dependencies[path].id, chunkId = dependencies[path].chunk
           
                var script = document.createElement('script')
               // @todo map src
                script.src = '/' + chunkId + '.js'
                script.onload = function() {
                    resolve(requireById(id))
                }
                document.head.appendChild(script)
           })
        }
      }
      
      function requireById(id) {
        if(caches[id]) return caches[id].exports
        
        var exports = {},
            module = caches[id] = {
              exports: exports
            }
            
        modules[id][0](makeRequire(id), module, exports, makeAsyncRequire(id))
        return module.exports
      }
      
      global.pkgrRequire = function(o) {
        var chunkModules = o[0], bootId = o[1]
        for(var i in m) {
          if(!modules[i]) modules[i] = chunkModules[i]
        }
        modules[bootId] && requireById(bootId)
      }
      ${additionalCode}
    })(this)
  `
}

function mainChunk (entry, chunkId) {
  return bootstrap(chunkCode(entry, chunkId))
}

function chunkCode (entry, chunkId) {
  const
    code = {},
    chunk = entry.chunks[chunkId]

  Object
    .keys(chunk.modules)
    .forEach(module => {
      code[module.id] =
        `[function(require, module, exports, import){${module.code}}, ${
          JSON.stringify(
            module.dependencies.reduce((prev, now) => {
              prev[now.value] = {
                id: entry.modulesByFilename[now.filename].id
              }
              if (now.async) {
                prev[now.value].chunk = prev[now.value].id
              }
              return prev
            }, {})
          )
          }]`
    })

  const c = `${Object.keys(code)
    .reduce((prev, id, i) => {
      prev += id + ':' + code[id] + (i === code.length - 1) ? '' : ','
      return prev
    }, '{')}}`

  return `
    ;(function(global){
      if(!global.pkgrRequire) throw new Error('ERROR')
      global.pkgrRequire([${c}, ${chunkId}])
    })(this)
  `
}

module.exports = Bundler