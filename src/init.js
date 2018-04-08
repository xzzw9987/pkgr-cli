const
  path = require('path'),
  fs = require('fs'),
  inquirer = require('inquirer'),
  through2 = require('through2'),
  cwd = process.cwd(),
  ensureDirectoryExistence = require('./utils/ensureDirectoryExistence')

module.exports = async () => {
  const project = {}
  const projectName = await inquirer.prompt({
      type: 'input',
      name: 'value',
      message: 'Type your project name',
      default: 'AwesomeProject'
    }),
    projectDir = path.join(cwd, projectName.value)

  project['name'] = projectName.value

  const t = await inquirer.prompt({
    type: 'list',
    name: 'value',
    message: 'Which type of project do you want ?',
    choices: [{name: 'React', value: 'react'}, {name: 'I don\'t want any framework', value: 'none'}]
  })

  project['type'] = t.value

  ensureDirectoryExistence(path.join(projectDir, 'stub'))
  ensureDirectoryExistence(path.join(projectDir, 'css/stub'))
  ensureDirectoryExistence(path.join(projectDir, 'js/stub'))

  switch (project['type']) {
    case 'react':
      const files = [
        {
          from: fs.createReadStream(path.resolve(__dirname, './prefabs/reactProject/package.json'))
            .pipe(through2(function (chunk, enc, callback) {
              const s = JSON.parse(chunk.toString())
              s.name = project['name']
              this.push(JSON.stringify(s, null, 2))
              callback()
            })),
          to: fs.createWriteStream(path.join(projectDir, 'package.json'))
        },
        {
          from: fs.createReadStream(path.resolve(__dirname, './prefabs/reactProject/babelrc.json')),
          to: fs.createWriteStream(path.join(projectDir, '.babelrc'))
        },
        {
          from: fs.createReadStream(path.resolve(__dirname, './prefabs/reactProject/configTemplate.js')),
          to: fs.createWriteStream(path.join(projectDir, 'pkgr.config.js'))
        },
        {
          from: fs.createReadStream(path.resolve(__dirname, './prefabs/reactProject/index.html')),
          to: fs.createWriteStream(path.join(projectDir, 'index.html'))
        },
        {
          from: fs.createReadStream(path.resolve(__dirname, './prefabs/reactProject/index.css')),
          to: fs.createWriteStream(path.join(projectDir, 'css/index.css'))
        },
        {
          from: fs.createReadStream(path.resolve(__dirname, './prefabs/reactProject/index.js')),
          to: fs.createWriteStream(path.join(projectDir, 'js/index.js'))
        }
      ]

      files.forEach(file => file.from.pipe(file.to))

      break
    default:
      break
  }
}

function promisifyEvent (source, event) {
  return new Promise(resolve => source.on(event, resolve))
}
