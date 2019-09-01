const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./base')

const context = process.cwd()
const pkg = require(path.resolve(context, './package.json'))
const className = path.basename(pkg.main, '.js')
const userConfig = require(path.resolve(context, process.env.USER_CONFIG)).prod

const webpackConfig = merge(baseWebpackConfig, {
  // Provides process.env.NODE_ENV with value production.
  // Enables UglifyJsPlugin, ModuleConcatenationPlugin and NoEmitOnErrorsPlugin.
  mode: 'production',
  output: {
    path: path.resolve(context, './dist')
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new webpack.BannerPlugin(
      '[name]'
      + (pkg.description ? ` - ${pkg.description}` : '')
      + `\n@version v${pkg.version}`
      + `\n@author ${pkg.author}`
      + `\n@license ${pkg.license}`
      + (pkg.repository ? `\n\n${pkg.repository.type} - ${pkg.repository.url}` : '')
    )
  ]
})

module.exports = [
  merge(webpackConfig, userConfig),
  merge(webpackConfig, {
    output: {
      filename: '[name].min.js'
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // https://github.com/terser/terser#output-options
            output: {
              comments: new RegExp('^!\\s*\\*\\s*' + className)
            },
            // https://github.com/terser/terser#compress-options
            compress: {
              warnings: true,
              drop_debugger: true,
              drop_console: true
            }
          }
        })
      ]
    }
  }, userConfig),
  merge(webpackConfig, {
    output: {
      path: path.resolve(context, './demo/js')
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: className,
        filename: '../index.html', // 相对于输出目录
        template: path.resolve(context, './src/index-template.html'), // 相对于根目录
        inject: false // 取消自动注入，使用模板手动注入
      })
    ]
  }, userConfig)
]
