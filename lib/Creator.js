const chalk = require('chalk')
const debug = require('debug')
const execa = require('execa')
const inquirer = require('inquirer')
const { installDeps } = require('./utils/installDeps')
const writeFileTree = require('./utils/writeFileTree')
const { hasGit, hasYarn } = require('./utils/env')
const { logWithSpinner, stopSpinner } = require('./utils/spinner')

module.exports = class Creator {
  constructor (name, context) {
    this.name = name
    this.camelCaseName = name.replace(/^\w/i, ($0) => $0.toUpperCase()).replace(/-(\w)/g, ($0, $1) => $1.toUpperCase())
    this.context = context
  }

  async create (cliOptions = {}) {

    let packageManager = cliOptions.packageManager
    if (!packageManager) {
      if (hasYarn()) {
        const answers = await inquirer.prompt([{
          name: 'packageManager',
          type: 'list',
          message: 'Pick the package manager to use when installing dependencies:',
          choices: [
            {
              name: 'Use Yarn',
              value: 'yarn',
              short: 'Yarn'
            },
            {
              name: 'Use NPM',
              value: 'npm',
              short: 'NPM'
            }
          ]
        }])
        packageManager = answers.packageManager
        debug(`${require('../package.json').name}:answers`)(answers)
      } else {
        packageManager = 'npm'
      }
    }

    const { name, camelCaseName, context } = this

    logWithSpinner(`✨`, `Creating module in ${chalk.yellow(context)}.`)

    // generate package.json with plugin dependencies
    const pkg = {
      name,
      version: '0.1.0',
      private: true,
      license: 'MIT',
      main: `dist/${camelCaseName}.js`,
      module: 'src/index.js',
      devDependencies: {
        'module-factory': 'latest'
      }
    }

    // write package.json
    await writeFileTree(context, {
      'package.json': JSON.stringify(pkg, null, 2)
    })

    // intilaize git repository before installing deps
    const shouldInitGit = await this.shouldInitGit(cliOptions)
    if (shouldInitGit) {
      logWithSpinner(`🗃 `, `Initializing git repository...`)
      await this.run('git init')
    }

    // install plugins
    stopSpinner()
    console.log(`⚙  Installing CLI plugins. This might take a while...`)
    console.log()
    await installDeps(context, packageManager, cliOptions.registry)

    // TODO 生成模板文件

    // install additional deps (injected by generators)
    console.log(`📦  Installing dependencies...`)
    console.log()
    await installDeps(context, packageManager, cliOptions.registry)

    // commit initial state
    let gitCommitFailed = false
    if (shouldInitGit) {
      await this.run('git add -A')
      const msg = typeof cliOptions.git === 'string' ? cliOptions.git : 'init'
      try {
        await this.run('git', ['commit', '-m', msg])
      } catch (e) {
        gitCommitFailed = true
      }
    }

    // log instructions
    console.log()
    console.log(`🎉  Successfully created module ${chalk.yellow(name)}.`)
    console.log(
      `👉  Get started with the following commands:\n\n` +
      (this.context === process.cwd() ? `` : chalk.cyan(` ${chalk.gray('$')} cd ${name}\n`)) +
      chalk.cyan(` ${chalk.gray('$')} ${packageManager === 'yarn' ? 'yarn dev' : 'npm run dev'}`)
    )
    console.log()

    if (gitCommitFailed) {
      warn(
        `Skipped git commit due to missing username and email in git config.\n` +
        `You will need to perform the initial commit yourself.\n`
      )
    }
  }

  run(command, args) {
    if (!args) { [command, ...args] = command.split(/\s+/) }
    return execa(command, args, { cwd: this.context })
  }

  async shouldInitGit (cliOptions) {
    if (!hasGit()) {
      return false
    }
    if (cliOptions.git) {
      return cliOptions.git !== 'false'
    }
    // check if we are in a git repo already
    try {
      await this.run('git', ['status'])
    } catch (e) {
      // if git status failed, let's create a fresh repo
      return true
    }
    // if git status worked, it means we are already in a git repo
    // so don't init again.
    return false
  }
}
