const path = require('path')
const merge = require('webpack-merge')
const context = process.cwd()
const userConfig = require(path.resolve(context, process.env.USER_CONFIG)).base

module.exports = merge({
  output: {
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: [path.resolve(context, './src')],
      options: {
        presets: [
          'env',
          'stage-0'
        ],
        plugins: [
          // lodash 按需加载
          'lodash',

          // 这个插件可以兼容一些ES6新增特性，但是也会增加代码体积，慎用
          // 'transform-runtime',

          // 这个插件的作用是
          // export default 导出的 ES6 模块被 babel 转义成 UMD 模块后
          // require 该模块可以直接得到模块返回值，而不是在 default 属性上
          'add-module-exports'
        ]
      }
    }]
  }
}, userConfig)
