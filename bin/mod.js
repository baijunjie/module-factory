#!/usr/bin/env node

const chalk = require('chalk') // 命令行输出彩色文字
const semver = require('semver') // 语义化版本
const program = require('commander') // 命令创建工具

const pkg = require('../package')
const requiredVersion = pkg.engines.node // 读取引擎版本要求

// 验证 node 版本
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

// 定义 create 命令
program
    .command('create <module-name>')
    .description('create a new module powered by mod')
    .option('-m, --packageManager <command>', 'Use specified npm client when installing dependencies')
    .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
    .option('-g, --git [message]', 'Force / skip git intialization, optionally specify initial commit message')
    .option('-f, --force', 'Overwrite target directory if it exists')
    .action((name, cmd) => {
        require('../lib/create')(name, cleanArgs(cmd))
    })

// 定义 dev 命令
program
    .command('dev [entry]')
    .description('dev a .js file in development mode with zero config')
    .option('-o, --open', 'Open browser')
    .action((entry, cmd) => {
        require('../lib/dev')(entry, cleanArgs(cmd))
    })

// 定义 build 命令
program
    .command('build [entry]')
    .option('-n, --name <name>', 'name for lib or web-component mode (default: entry filename)')
    .option('-d, --dest <dir>', 'output directory (default: dist)')
    .description('build a .js file in production mode with zero config')
    .action((entry, cmd) => {
        require('../lib/build')(entry, cleanArgs(cmd))
    })

// 如果输入了未定义的 <command>，会执行这个动作
program
    .arguments('<command>')
    .action((cmd) => {
        program.outputHelp() // 首先输出基础帮助
        console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)) // 输出错误信息
        console.log()
    })

// 附加帮助信息
program.on('--help', () => {
    console.log()
    console.log(`  Run ${chalk.cyan(`mod <command> --help`)} for detailed usage of given command.`)
    console.log()
})

// 遍历之前创建的命令，为他们添加附加帮助信息
// 这里只在最后添加一个空行
program.commands.forEach(c => c.on('--help', () => console.log()))

// 增强常见错误信息
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

// 缺少参数
enhanceErrorMessages('missingArgument', argName => {
    return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

// 未知的选项
enhanceErrorMessages('unknownOption', optionName => {
    return `Unknown option ${chalk.yellow(optionName)}.`
})

// 选项缺少参数
enhanceErrorMessages('optionMissingArgument', (option, flag) => {
    return `Missing required argument for option ${chalk.yellow(option.flags)}` + (
        flag ? `, got ${chalk.yellow(flag)}` : ``
    )
})

// 解析当前的参数并执行
program.parse(process.argv)

// 当前命令 argv 不足 3 个时输出帮助信息
if (!process.argv.slice(2).length) {
    program.outputHelp()
}

// 将命令中的参数提取到对象中，并返回
function cleanArgs (cmd) {
    // 遍历命令的选项参数对象，提取参数
    const args = {}
    cmd.options.forEach(o => {
        const key = o.long.replace(/^--/, '') // 将长版本参数去掉 "--" 作为 key
        // 如果命令中存在与该名称相同的方法，则不应该提取它
        if (typeof cmd[key] !== 'function') {
            args[key] = cmd[key]
        }
    })
    return args
}