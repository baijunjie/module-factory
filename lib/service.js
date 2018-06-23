const {
  error,
  resolveModule,
} = require('@module-factory/shared-utils')
const serviceModuleName = '@module-factory/service'

module.exports = (mode, configPath, options) => {
  const context = process.cwd()
  const serviceModulePath = resolveModule(serviceModuleName, context)

  if (!serviceModulePath) {
    return error(`The module "${serviceModuleName}" is missing, please make sure this directory is correct.`)
  }

  const service = require(serviceModulePath)[mode]
  service(context, configPath, options)
}