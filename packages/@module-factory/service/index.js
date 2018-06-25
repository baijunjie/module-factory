const path = require('path')
const userConfigName = 'mod.config.js'

module.exports = (context) => {
  const configPath = path.relative(context, __dirname)
  return {
    'dev': `USER_CONFIG=${userConfigName} webpack-dev-server --config ${configPath}/webpack.config/dev.js`,
    'build': `USER_CONFIG=${userConfigName} webpack --config ${configPath}/webpack.config/prod.js`
  }
}