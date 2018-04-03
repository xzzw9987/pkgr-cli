const
  fs = require('fs'),
  path = require('path'),
  conf = require('../../config/global'),
  outputPath = conf.output.path,
  ensure = require('../../utils/ensureDirectoryExistence'),
  devServer = require('../../devServer')()

class Bundler {
  constructor (entry) {
    this._entry = entry
    this._code = null
    this._chunkCode = []
  }

  async bundle (filename/*optional*/) {
    if (conf.env === 'production')
      return await this.bundleProd(filename)
    return await this.bundleDev(filename)
  }

  async bundleDev (filename) {
    return await this.bundleCode(filename,
      (filename, chunkId) => {
        devServer.add(path.basename(filename), entryChunkCode(this._entry, chunkId))
      },
      (filename, chunkId) => {
        devServer.add(path.basename(filename), chunkCode(this._entry, chunkId))
      })
  }

  async bundleProd (filename) {
    return await this.bundleCode(filename,
      (filename, chunkId) => {
        ensure(filename)
        fs.writeFileSync(filename, entryChunkCode(this._entry, chunkId))
      },
      (filename, chunkId) => {
        ensure(filename)
        fs.writeFileSync(filename, chunkCode(this._entry, chunkId))
      })
  }

  async bundleCode (filename, initialChunkCallback, chunkCallback) {
    const initialChunkId = Math.min.apply(null, Object.keys(this._entry.chunks))
    let src = []

    Object
      .keys(this._entry.chunks)
      .forEach(chunkId => {
        // @todo mapper
        const
          basename = `${chunkId}.js`,
          f = path.join(outputPath, basename)

        if (initialChunkId === parseInt(chunkId, 10)) {
          src.push(path.join('/', basename))
          initialChunkCallback && initialChunkCallback(f, chunkId)
        }
        else {
          chunkCallback && chunkCallback(f, chunkId)
        }
      })

    return {
      src
    }
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
      
      global.process = {env: '${process.env.NODE_ENV || 'development'}'}
      ${additionalCode}
    })(this)
  `
}

function entryChunkCode (entry, chunkId) {
  return bootstrapCode(chunkCode(entry, chunkId))
}

/*
* module's shape
* [
*   someCode,
*   {
*     './a.js': {id: moduleId, chunk: chunkId// optional }
*   }
* ]
**/

function chunkCode (entry, chunkId) {
  const
    code = {},
    chunk = entry.chunks[chunkId]

  Object
    .keys(chunk.modules)
    .forEach(moduleId => {
      const module = chunk.modules[moduleId]
      code[moduleId] =
        `[function(require, module, exports, asyncImport){
        ${module.code}
        }, ${
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