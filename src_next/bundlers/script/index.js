const
    fs = require('fs')

class Bundler {
  constructor (entry) {
    this._entry = entry
    this._code = null
    this._chunkCode = []
  }

  bundle () {
    const initialChunkId = Math.min.apply(null, Object.keys(this._entry.chunks))

    Object
      .keys(this._entry.chunks)
      .forEach(chunkId => {
        if (initialChunkId === parseInt(chunkId, 10)) {
          fs.writeFileSync(`${process.cwd()}/${chunkId}.js`, entryChunkCode(this._entry, chunkId))
        }
        else {
          fs.writeFileSync(`${process.cwd()}/${chunkId}.js`, chunkCode(this._entry, chunkId))
        }
      })
  }
}

function bootstrapCode (additionalCode) {
  return `
    ;(function(global){
      var modules = {}, caches = {}
      
      function makeRequire(id) {
        if(!modules[id]) throw new Error(id + ': not found')
        var dependencies = modules[id][1]
        return function(path) {
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
        for(var i in chunkModules) {
          if(!modules[i]) modules[i] = chunkModules[i]
        }
        modules[bootId] && requireById(bootId)
      }
      ${additionalCode}
    })(this)
  `
}

function entryChunkCode (entry, chunkId) {
  return bootstrapCode(chunkCode(entry, chunkId))
}

function chunkCode (entry, chunkId) {
  const
    code = {},
    chunk = entry.chunks[chunkId]

  Object
    .keys(chunk.modules)
    .forEach(moduleId => {
      const module = chunk.modules[moduleId]
      code[moduleId] =
        `[function(require, module, exports, asyncImport){${module.code}}, ${
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

  const
    ks = Object.keys(code),
    c = `${
      ks.reduce((prev, id, i) => {
        prev += id + ':' + code[id] + (i === ks.length - 1 ? '' : ',')
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