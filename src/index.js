const
  fs = require('fs'),
  babylon = require('babylon'),
  path = require('path'),
  crypto = require('crypto'),
  entries = require('./fileEntry'),
  traverse = require('./traverse'),
  findModuleRealPath = require('./findModuleRealPath'),
  generateBundle = require('./generateBundle'),
  saveBundle = require('./saveBundle')

const
  depsAbsoluteSet = new Set,
  deps = {},
  makeModuleId = moduleIdFactory()

entries.forEach(filename => processFile(filename, makeModuleId()))
// console.log(deps)
const
  content = generateBundle(deps),
  filename = crypto
    .createHash('md5')
    .update(content)
    .digest('hex')
    .substring(0, 8)

saveBundle(`${filename}.js`, content)
// fs.createWriteStream(`./${filename}.js`).end(content)
debugger

function moduleIdFactory () {
  let id = 1
  return () => id++
}

function processFile (filename, id) {
  try {
    fs.statSync(filename)
  }
  catch (e) {
    console.error(`Can't find file: ${filename}`)
    return
  }

  const
    content = fs.readFileSync(filename).toString(),
    ast = babylon.parse(content, {sourceType: 'module'}),
    moduleId = id

  deps[moduleId] = {id: moduleId, deps: {}, absolutePath: filename, content}

  traverse(ast, (err, result) => {
    if (err) {
      console.log(`${filename}: ${err}`)
      return
    }
    const
      depPath = result.value,
      depAbsolutePath = findModuleRealPath(path.dirname(filename), depPath),
      dep = findDep(depAbsolutePath)

    if (!dep) {
      const depModuleId = makeModuleId()
      deps[moduleId].deps[depPath] = {id: depModuleId, path: depPath}
      // Put dep to deps map
      depsAbsoluteSet.add(depAbsolutePath)
      processFile(depAbsolutePath, depModuleId)
    }
    else {
      const depModuleId = dep.id
      deps[moduleId].deps[depPath] = {id: depModuleId, path: depPath}
    }
  })
}

function findDep (path) {
  if (!depsAbsoluteSet.has(path))
    return
  let ret
  for (let moduleId in deps) {
    if (deps[moduleId].absolutePath === path) {
      ret = deps[moduleId]
      break
    }
  }
  return ret
}