const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const createDomain = require('webpack-dev-server/lib/util/createDomain')
const merge = require('webpack-merge')
const open = require('opn')
const { warn } = require('@module-factory/shared-utils')
const debug = require('debug')('webpack')
const configName = 'mod.config.js'

exports.dev = (context, configPath, options) => {
  let config = getConfig(context, configPath)
  let devConfig = require('./webpack.config/dev')(context)

  options = merge(devConfig.devServer || {}, options)
  delete devConfig.devServer

  devConfig = merge(
    devConfig,
    config.base,
    config.dev
  )

  debug('devConfig =>')
  debug(devConfig)
  console.log()
  console.log()
  debug('webpackDevServerOptions =>')
  debug(options)

  const server = new WebpackDevServer(webpack(devConfig), options)
  server.listen(options.port, options.host, (err) => {
    if (err) throw err;
    if (options.open) {
      const suffix = (options.inline !== false || options.lazy === true ? '/' : '/webpack-dev-server/')
      const uri = createDomain(options, server.listeningApp) + suffix
      open(uri + (options.openPage || ''))
    }
  })
}

exports.prod = (context, configPath, options) => {
  let config = getConfig(context, configPath)
  let prodConfigs = require('./webpack.config/prod')(context)

  prodConfigs = prodConfigs.map(prodConfig => {
    prodConfig = merge(
      prodConfig,
      config.base,
      config.prod
    )

    if (options.dest) {
      prodConfig = merge(prodConfig, {
        output: {
          path: path.resolve(context, options.dest)
        }
      })
    }

    return prodConfig
  })

  debug('prodConfigs =>')
  debug(prodConfigs)

  webpack(prodConfigs, (err, stats) => {
    if (stats.hash) {
      const statsString = stats.toString({
        colors: { level: 2, hasBasic: true, has256: true, has16m: false }
      })
      if (statsString) process.stdout.write(statsString)
    }
  })
}

function getConfig(context, configPath) {
  configPath = configPath || `./${configName}`
  let config

  if (fs.existsSync(configPath)) {
    config = require(path.resolve(context, configPath))
  } else {
    warn(`The config file "${configName}" is missing, will use default settings.`)
    config = {}
  }

  return config;
}