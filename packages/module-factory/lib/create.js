const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer') // Interactive command-line user interface
const validateProjectName = require('validate-npm-package-name')
const {
  error,
  stopSpinner,
  updateVersionTips,
} = require('@module-factory/shared-utils')
const pkg = require('../package')
const Creator = require('./Creator')

async function create (moduleName, options) {

  // If the module name is a '.', use the current directory name as the module name
  // and create the module development initialization file in the current directory
  const inCurrent = moduleName === '.'
  const name = inCurrent ? path.relative('../', process.cwd()) : moduleName
  const targetDir = path.resolve(moduleName || '.')

  // Verify module name is valid
  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    error(`Invalid module name: "${moduleName}"`)
    result.errors && result.errors.forEach(err => {
      error(err)
    })
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      if (inCurrent) {
        await updateVersionTips(pkg.name, pkg.version)
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `Generate module in current directory?`
          }
        ])
        if (!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Merge', value: 'merge' },
              { name: 'Cancel', value: false }
            ]
          }
        ])
        if (!action) {
          return
        } else if (action === 'overwrite') {
          await fs.remove(targetDir)
        }
      }
    }
  }

  // Start create
  const creator = new Creator(name, targetDir)
  await creator.create(options)
}

module.exports = (...args) => {
  create(...args).catch(err => {
    stopSpinner(false)
    error(err)
    process.exit(1)
  })
}
