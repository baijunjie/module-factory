const chalk = require('chalk')
const execa = require('execa')
const inquirer = require('inquirer')
const {
  installDeps,
  resolveModule,
  writeFileTree,
  hasGit,
  hasYarn,
  logWithSpinner,
  stopSpinner,
} = require('@module-factory/shared-utils')

module.exports = class Creator {
  constructor (name, context) {
    this.name = name
    this.context = context
  }

  async create (cliOptions = {}) {
    const { name, context } = this
    const packageManager = await this.getPackageManager(cliOptions);

    logWithSpinner(`✨`, `Creating module in ${chalk.yellow(context)}.`)

    // generate package.json with plugin dependencies
    const pkg = {
      name,
      devDependencies: {
        '@module-factory/template': 'latest',
        //'@module-factory/config': 'latest',
        '@module-factory/utils': 'latest',
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
    console.log('⚙  Installing dependencies. This might take a while...')
    console.log()
    await installDeps(context, packageManager, cliOptions.registry)

    console.log('⚙  Creating templates...')
    console.log()
    const files = await this.getTemplateFiles(pkg)
    await writeFileTree(context, files)

    // install additional deps
    console.log(`📦  Installing additional dependencies...`)
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
      console.warn(
        `Skipped git commit due to missing username and email in git config.\n` +
        `You will need to perform the initial commit yourself.\n`
      )
    }
  }

  run (command, args) {
    if (!args) { [command, ...args] = command.split(/\s+/) }
    return execa(command, args, { cwd: this.context })
  }

  async getTemplateFiles (pkg) {
    const resolvedPath = resolveModule('@module-factory/template', this.context)

    if (!resolvedPath) {
      console.error(chalk.red('The dependency module @module-factory/template is missing.'))
      process.exit(1)
      return
    }

    const apply = require(resolvedPath)
    return apply(this.name, pkg)
  }

  async getPackageManager (cliOptions) {
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
      } else {
        packageManager = 'npm'
      }
    }
    return packageManager;
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
