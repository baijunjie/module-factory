const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const {
  warn,
  error,
  resolveModule,
} = require('@module-factory/shared-utils')
const serviceModuleName = '@module-factory/service'
const configName = 'mod.config.js'

module.exports = (mode, configPath, options) => {
  configPath = configPath || `./${configName}`
  const context = process.cwd()
  const serviceModulePath = resolveModule(serviceModuleName, context)

  if (!serviceModulePath) {
    return error(`The module "${serviceModuleName}" is missing, please make sure this directory is correct.`)
  }

  const service = require(serviceModulePath)[mode]
  let config

  if (fs.existsSync(configPath)) {
    config = require(path.resolve(context, configPath))
  } else {
    warn(`The config file "${configName}" is missing, will use default settings.`)
    config = {}
  }

  console.log('config : ', config)
  console.log('options : ', options)
  service(config)
}