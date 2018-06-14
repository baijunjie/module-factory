const request = require('./request')
const current = require(`../../package.json`).version

module.exports = async function getVersions(moduleName) {
  process.env.MODULE_VERSION = process.env.MODULE_VERSION || {};

  let latest
  if (process.env.MODULE_VERSION[moduleName]) {
    // cached value
    latest = process.env.MODULE_VERSION[moduleName]
  } else {
    const res = await request.get(`https://registry.npmjs.org/${moduleName}/latest`)

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
