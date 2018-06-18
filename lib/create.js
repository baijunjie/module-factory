const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer') // 交互式命令行用户界面
const { stopSpinner } = require('@module-factory/shared-utils')
const Creator = require('./Creator')
const validateProjectName = require('validate-npm-package-name')

async function create (moduleName, options) {

  // 如果模块名称是一个 '.'，则使用当前目录名作为模块名称，且创建模块开发初始化文件在当前目录中
  const inCurrent = moduleName === '.'
  const name = inCurrent ? path.relative('../', process.cwd()) : moduleName
  const targetDir = path.resolve(moduleName || '.')

  // 验证模块名称是否有效
  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid module name: "${moduleName}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red(err))
    })
    process.exit(1)
  }

  // 验证目标目录是否存在
  if (fs.existsSync(targetDir)) {
    // 是否设置了强制覆盖
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      if (inCurrent) {
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

  // 开始创建
  const creator = new Creator(name, targetDir)
  await creator.create(options)
}

module.exports = (...args) => {
  create(...args).catch(err => {
    stopSpinner(false)
    console.error(err)
    process.exit(1)
  })
}
