const fs = require('fs')
const path = require('path')
const globby = require('globby')
const { sortObject } = require('@module-factory/shared-utils')

module.exports = async (name, pkg) => {
  const filesDir = path.resolve(__dirname, './template')
  const filesPath = await globby(['**/*'], { cwd: filesDir })
  const files = {}

  for (const rawPath of filesPath) {
    let filename = path.basename(rawPath)
    // dotfiles are ignored when published to npm, therefore in templates
    // we need to use underscore instead (e.g. "_gitignore")
    if (filename.charAt(0) === '_') {
      filename = `.${filename.slice(1)}`
    }
    const targetPath = path.join(path.dirname(rawPath), filename)
    const sourcePath = path.resolve(filesDir, rawPath)
    const content = fs.readFileSync(sourcePath, 'utf-8')
    // only set file if it's not all whitespace, or is a Buffer (binary files)
    if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
      files[targetPath] = content
    }
  }

  const camelCaseName = name.replace(/^\w/i, ($0) => $0.toUpperCase()).replace(/-(\w)/g, ($0, $1) => $1.toUpperCase())

  pkg = Object.assign(
    pkg,
    JSON.parse(files['package.json']),
    {
      main: `dist/${camelCaseName}.js`,
      module: 'src/index.js',
      scripts: {
        'dev': 'webpack-dev-server --config webpack/webpack.config.dev.js' + (
          // only auto open browser on MacOS where applescript
          // can avoid dupilcate window opens
          process.platform === 'darwin' ? ' --open' : ''
        ),
        'build': 'webpack --config webpack/webpack.config.prod.js'
      }
    }
  )

  pkg = sortObject(pkg, [
      'name',
      'version',
      'private',
      'main',
      'module',
      'scripts',
      'dependencies',
      'devDependencies'
  ])

  files['package.json'] = JSON.stringify(pkg, null, 2)

  return files
}