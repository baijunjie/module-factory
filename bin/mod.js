#!/usr/bin/env node

const chalk = require('chalk')
const semver = require('semver')
const program = require('commander')

const pkg = require('../package')
const requiredVersion = pkg.engines.node // Read engine version requirements

// Verify node version
if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(chalk.red(
    `You are using Node ${process.version}, but this version of module-factory ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  ))
  process.exit(1)
}

// Usage: mod <command> [options]
program
  .version(pkg.version, '-v, --version')
  .usage('<command> [options]')

// Define the `create` command
program
  .command('create <module-name>')
  .description('create a new module powered by module-factory')
  .option('-n, --className <name>', 'Module class name, default is upper camel case for the module name')
  .option('-m, --packageManager <command>', 'Use specified npm client when installing dependencies')
  .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
  .option('-g, --git [message]', 'Force / skip git intialization, optionally specify initial commit message')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .action((name, cmd) => {
    require('../lib/create')(name, cleanArgs(cmd))
  })

// Define the `dev` command
program
  .command('dev [config]')
  .description('Launch development mode. [config] User personalization config file, The "mod.config.js" file in the root directory is used by default.')
  .option('-o, --open', 'Open browser')
  .option('-p, --port <port>', 'server listen port')
  .action((config, cmd) => {
    require('../lib/service')('dev', config, cleanArgs(cmd))
  })

// Define the `build` command
program
  .command('build [config]')
  .description('Build the final code. [config] User personalization config file, The "mod.config.js" file in the root directory is used by default.')
  .option('-d, --dest <dir>', 'output directory (default: dist)')
  .action((config, cmd) => {
    require('../lib/service')('prod', config, cleanArgs(cmd))
  })

// If enter an undefined <command>, this action is performed
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp() // First output the basic help
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)) // Output error message
    console.log()
  })

// 附加帮助信息
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`mod <command> --help`)} for detailed usage of given command.`)
  console.log()
})

// Iterate through the commands created adding additional help information to them
// Only an empty row is added at the end
program.commands.forEach(c => c.on('--help', () => console.log()))

// Enhance common error information
const enhanceErrorMessages = (methodName, log) => {
  program.Command.prototype[methodName] = function (...args) {
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return
    }
    this.outputHelp()
    console.log(`  ` + chalk.red(log(...args)))
    console.log()
    process.exit(1)
  }
}

// Missing parameter
enhanceErrorMessages('missingArgument', argName => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

// Unknown options
enhanceErrorMessages('unknownOption', optionName => {
  return `Unknown option ${chalk.yellow(optionName)}.`
})

// Option missing parameter
enhanceErrorMessages('optionMissingArgument', (option, flag) => {
  return `Missing required argument for option ${chalk.yellow(option.flags)}` + (
      flag ? `, got ${chalk.yellow(flag)}` : ``
    )
})

// Parses the current parameters and executes
program.parse(process.argv)

// When the current command `argv` is less than 3, help information is output
if (!process.argv.slice(2).length) {
  program.outputHelp()
}

// Extract the parameters from the command into the object
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = o.long.replace(/^--/, '') // Remove the long version parameter "--" as the key
    // If a method with the same name exists in the command, it should not be extracted
    if (typeof cmd[key] !== 'function') {
      args[key] = cmd[key]
    }
  })
  return args
}