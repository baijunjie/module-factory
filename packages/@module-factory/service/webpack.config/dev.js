const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (context) => {
  const baseWebpackConfig = require('./base')(context)
  const pkg = require(path.resolve(context, './package.json'))
  const className = path.basename(pkg.main, '.js')
  return merge(baseWebpackConfig, {
    // Provides process.env.NODE_ENV with value development.
    // Enables NamedModulesPlugin.
    mode: 'development',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        title: className,
        filename: 'index.html', // 相对于输出目录
        template: './src/index-template.html', // 相对于根目录
        inject: false // 取消自动注入，使用模板手动注入
      })
    ],
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    devServer: {
      contentBase: path.resolve(context, './demo'),
      compress: true, // 一切服务都启用 gzip 压缩
      inline: true,
      open: true,
      hot: true,
      host: 'localhost',
      port: 9000
    }
  })
}
