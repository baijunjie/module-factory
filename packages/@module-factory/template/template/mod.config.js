// Webpack configuration
module.exports = {
  base: {
    entry: {
      <%= className %>: './src/index.js'
    },
    externals: {
      <% if (useJQuery) { %>'jquery': {
        commonjs: 'jquery',
        commonjs2: 'jquery',
        amd: 'jquery',
        root: 'jQuery'
      }<% } %>
    }
  },

  dev: {
    // https://webpack.js.org/configuration/dev-server/
    devServer: {
      host: 'localhost',
      port: 9000
    }
  },

  prod: {

  }
}