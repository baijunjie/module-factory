const path = require('path')
const merge = require('webpack-merge')
const context = process.cwd()
const userConfig = require(path.resolve(context, process.env.USER_CONFIG)).base

module.exports = merge({
  output: {
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: [
          [ '@babel/preset-env', { 'modules': 'umd' } ]
        ],
        plugins: [
          // lodash 按需加载
          'lodash',

          // 这个插件可以兼容一些ES6新增特性，但是也会增加代码体积，慎用
          // '@babel/plugin-transform-runtime',
        ]
      }
    }]
  }
}, userConfig)
