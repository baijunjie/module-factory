const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const globby = require('globby')
const isBinary = require('isbinaryfile')
const inquirer = require('inquirer')
const { sortObject } = require('@module-factory/shared-utils')
const { extend } = require('@module-factory/utils')
const debug = require('debug')('template')

// pkg must contain name attribute
module.exports = async (className, pkg) => {
  // default is upper camel case for the module name
  className = className || pkg.name.replace(/^\w/i, ($0) => $0.toUpperCase()).replace(/-(\w)/g, ($0, $1) => $1.toUpperCase())

  const answers = await userOptions()
  const deps = []
  const devDeps = []

  if (answers.es6Module) deps.push('"@module-factory/utils": "latest"')
  else devDeps.push('"@module-factory/utils": "latest"')
  if (answers.useJQuery) deps.push('"jquery": "latest"')
  if (answers.useLodash) deps.push('"lodash": "latest"')

  const filesDir = path.resolve(__dirname, './template')

  debug('')
  debug('filesDir : ' + filesDir)

  const filesPath = await globby(['**/*'], { cwd: filesDir })

  debug('')
  debug('filesPath : ' + filesPath)

  const files = {}

  for (const relativePath of filesPath) {
    let filename = path.basename(relativePath)
    // dotfiles are ignored when published to npm, therefore in templates
    // we need to use underscore instead (e.g. '_gitignore')
    if (filename.charAt(0) === '_') {
      filename = filename.slice(1)
    }
    const targetPath = path.join(path.dirname(relativePath), filename)
    const sourcePath = path.resolve(filesDir, relativePath)
    const content = isBinary.sync(sourcePath) ?
      fs.readFileSync(sourcePath) : // return buffer
      ejs.render(fs.readFileSync(sourcePath, 'utf-8'), { className, deps, devDeps, ...answers })
    // only set file if it's not all whitespace, or is a Buffer (binary files)
    if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
      files[targetPath] = filename === 'package.json' ? extendPackage(pkg, content) : content
      debug(`
┌──${`─`.repeat(filename.length)}──┐
│  ${filename}  │
└──${`─`.repeat(filename.length)}──┘`)
      debug(files[targetPath])
    }
  }

  return files
}

function extendPackage(pkg, pkgJson) {
  return JSON.stringify(
    sortObject(
      extend(
        true,
        pkg,
        JSON.parse(pkgJson)
      ),
      [
        'private',
        'name',
        'version',
        'description',
        'author',
        'license',
        'main',
        'module',
        'files',
        'scripts',
        'dependencies',
        'devDependencies'
      ]
    ),
    null,
    2
  )
}

async function userOptions() {
  const answers = await inquirer.prompt([{
    name: 'useJQuery',
    type: 'confirm',
    message: 'Whether to use jQuery?'
  }, {
    name: 'useLodash',
    type: 'confirm',
    message: 'Whether to use Lodash?'
  }, {
    name: 'es6Module',
    type: 'confirm',
    message: 'When your module is publish to NPM, do you want to publish it as an es6 module?'
  }])
  debug('')
  debug('answers ↓')
  debug(answers)
  return answers
}
