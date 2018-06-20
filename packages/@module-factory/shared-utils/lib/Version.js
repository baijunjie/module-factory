const chalk = require('chalk')
const semver = require('semver')
const { clearConsole } = require('./logger')
const { get } = require('./request')

exports.getVersions = async (moduleName, current) => {
  process.env.MODULE_VERSION = process.env.MODULE_VERSION || {};

  let latest
  if (process.env.MODULE_VERSION[moduleName]) {
    // cached value
    latest = process.env.MODULE_VERSION[moduleName]
  } else {
    const res = await get(`https://registry.npmjs.org/${moduleName}/latest`)

    if (res.statusCode === 200) {
      latest = process.env.MODULE_VERSION[moduleName] = res.body.version
    } else {
      // fallback to local version
      latest = process.env.MODULE_VERSION[moduleName] = current
    }
  }

  return {
    current,
    latest
  }
}

exports.updateVersionTips = async (moduleName, currentVersion) => {
  const { current, latest } = await exports.getVersions(moduleName, currentVersion)

  let title = chalk.bold.blue(`module-factory v${current}`)

  if (semver.gt(latest, current)) {
    title += chalk.green(`
┌────────────────────${`─`.repeat(latest.length)}──┐
│  Update available: ${latest}  │
└────────────────────${`─`.repeat(latest.length)}──┘`)
  }

  clearConsole(title)
}
