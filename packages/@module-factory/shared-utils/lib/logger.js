const chalk = require('chalk')
const readline = require('readline')

const format = (label, originLabel, msg) => {
  let labelLength = 1

  if (Array.isArray(originLabel)) {
    originLabel.forEach(label => labelLength += label.length + 2)
  } else if (typeof originLabel === 'string') {
    labelLength += originLabel.length + 2
  } else {
    labelLength += label.length
  }

  return msg.split('\n').map((line, i) => {
    return i === 0
      ? `${label} ${line}`
      : line.padStart(labelLength + line.length)
  }).join('\n')
}

const chalkTag = msg => chalk.bgBlackBright.whiteBright(` ${msg} `)

exports.log = (msg = '', tag = null) => tag ? console.log(format(chalkTag(tag), tag.length + 2, msg)) : console.log(msg)

exports.info = (msg, tag = null) => {
  console.log(
    tag ?
    format(chalk.bgBlue.whiteBright(' INFO ') + chalkTag(tag), ['INFO', tag], msg) :
    format(chalk.bgBlue.whiteBright(' INFO '), ' INFO ', msg)
  )
}

exports.done = (msg, tag = null) => {
  console.log(
    tag ?
    format(chalk.bgGreen.whiteBright(' DONE ') + chalkTag(tag), ['DONE', tag], msg) :
    format(chalk.bgGreen.whiteBright(' DONE '), 'DONE', msg)
  )
}

exports.warn = (msg, tag = null) => {
  console.warn(
    tag ?
    format(chalk.bgYellow.whiteBright(' WARN ') + chalkTag(tag), ['WARN', tag], chalk.yellow(msg)) :
    format(chalk.bgYellow.whiteBright(' WARN '), 'WARN', chalk.yellow(msg))
  )
}

exports.error = (msg, tag = null) => {
  console.error(
    tag ?
    format(chalk.bgRed.whiteBright(' ERROR ') + chalkTag(tag), ['ERROR', tag], chalk.red(msg)) :
    format(chalk.bgRed.whiteBright(' ERROR '), 'ERROR', chalk.red(msg))
  )
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

exports.clearConsole = title => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      console.log(title)
    }
  }
}
