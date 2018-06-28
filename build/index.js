const fs = require('fs')
const path = require('path')
const minimist = require('minimist')
const globby = require('globby')
const execa = require('execa')
const { info, done, error, writeFileTree } = require('@module-factory/shared-utils')
const debug = require('debug')('build')

const args = minimist(process.argv)
const publish = args.p || args.publish
const unpublish = args.u || args.unpublish
const version = args.v || args.version || (typeof publish === 'string' ? publish : null) || require('../package.json').version

if (publish) info('publish version : ' + version)
else info('build version : ' + version)
if (unpublish) info('unpublish version : ' + unpublish)

const isDebug = process.env.DEBUG === 'build'
const context = path.resolve(__dirname, '..')

globby(['**/package.json', '!build', '!**/node_modules'], { cwd: context }).then(async filesPath => {
  debug('filesPath ↓')
  debug(filesPath)

  const files = []
  let modulesDir = {}

  for (const rawPath of filesPath) {
    const sourcePath = path.resolve(context, rawPath)
    const content = fs.readFileSync(sourcePath)
    const pkg = JSON.parse(content)
    pkg.version = version
    files[rawPath] = JSON.stringify(pkg, null, 2)
    if ((publish || unpublish) && !rawPath.indexOf('packages')) modulesDir[pkg.name] = path.dirname(sourcePath)
    debug('file => ' + rawPath + ' : ' + pkg.version)
  }

  info('Rewriting the package.json...')
  if (!isDebug) await writeFileTree(context, files)
  info('Rewriting done.')

  modulesDir = Object.entries(modulesDir)

  if (publish) {
    await login()
    info(`Publish new version ${version}...`)
    for (const [name, path] of modulesDir) {
      try {
        info('Publish module : ' + name)
        if (!isDebug) {
          const p = execa('npm', ['publish'], { cwd: path })
          p.stdout.pipe(process.stdout)
          await p
        }
        done('Publish successfully.')
      } catch(err) {
        error(err.stderr)
        process.exit(1)
      }
    }
  }

  if (unpublish) {
    await login()
    info(`Unpublish version ${unpublish} ...`)
    for (const [name, path] of modulesDir) {
      try {
        info('Unpublish module : ' + `${name}@${unpublish}`)
        if (!isDebug) {
          const p = execa('npm', ['unpublish', `${name}@${unpublish}`], { cwd: path })
          p.stdout.pipe(process.stdout)
          await p
        }
        done('Unpublish successfully.')
      } catch(err) {
        error(err.stderr)
      }
    }
  }
})

let logined = false
async function login() {
  if (logined) return Promise.resolve()
  const token = require('./token')
  debug('User ↓')
  debug(token)
  try {
    info('Login...')
    const p = execa('npm', ['login'])
    p.stdout.on('data', data => {
      data = data.toString()
      if (data.match(/Username/)) {
        p.stdin.write(`${token.username}\n`)
      } else if (data.match(/Password/)) {
        p.stdin.write(`${token.password}\n`)
      } else if (data.match(/Email/)) {
        p.stdin.write(`${token.email}\n`)
      }
    }).pipe(process.stdout)
    await p
    logined = true
    done('Login successfully.')
  } catch(err) {
    error(err.stderr)
    process.exit(1)
  }
}


