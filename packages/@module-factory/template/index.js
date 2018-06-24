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

  const useJQuery = await whetherUseJQuery()

  const filesDir = path.resolve(__dirname, './template')

  debug('filesDir : ' + filesDir)

  const filesPath = await globby(['**/*'], { cwd: filesDir })

  debug('filesPath : ' + filesPath)

  const files = {}

  for (const rawPath of filesPath) {
    debug('filesPath => rawPath : ' + rawPath)

    let filename = path.basename(rawPath)
    // dotfiles are ignored when published to npm, therefore in templates
    // we need to use underscore instead (e.g. '_gitignore')
    if (filename.charAt(0) === '_') {
      filename = `.${filename.slice(1)}`
    }
    const targetPath = path.join(path.dirname(rawPath), filename)
    const sourcePath = path.resolve(filesDir, rawPath)
    const content = isBinary.sync(sourcePath) ?
      fs.readFileSync(sourcePath) : // return buffer
      ejs.render(fs.readFileSync(sourcePath, 'utf-8'), { className, useJQuery })
    // only set file if it's not all whitespace, or is a Buffer (binary files)
    if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
      files[targetPath] = content
    }
  }

  pkg = sortObject(
    extend(
      true,
      pkg,
      {
        'private': true,
        'version': '0.1.0',
        'description': '',
        'author': '',
        'license': 'MIT',
        'main': `dist/${className}.js`,
        'module': 'src/index.js',
        'files': [
          'src',
          'dist',
          '!.DS_Store'
        ],
        'devDependencies': {
          '@module-factory/utils': 'latest',
          'lodash': 'latest'
        }
      }
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
  )

  files['package.json'] = JSON.stringify(pkg, null, 2)

  debug('package.json : ' + files['package.json'])
  return files
}

async function whetherUseJQuery() {
  const answers = await inquirer.prompt([{
    name: 'useJQuery',
    type: 'confirm',
    message: 'Whether to use jQuery?'
  }])
  return answers.useJQuery
}
