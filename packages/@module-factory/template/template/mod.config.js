module.exports = {
  base: {
    entry: {
      <%= className %>: './src/index.js' // 相对于根目录
    },
    resolve: {
      alias: {
        'utils': '@module-factory/utils'
      }
    },
    externals: {
      'jquery': {
        commonjs: 'jquery',
        commonjs2: 'jquery',
        amd: 'jquery',
        root: 'jQuery'
      }
    }
  },

  dev: {

  },

  prod: {

  }
}