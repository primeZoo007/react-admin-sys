const webpack = require('webpack')
const path = require('path')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.base.config')
const getConfig = require('./config')
const config = getConfig('local')
const { resolve } = require('path')
require('isomorphic-fetch')

module.exports = (async () => {
  return Object.assign({}, baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      contentBase: path.join(__dirname, '/'),
      port: config.port,
      host: config.host,
      compress: true,
      publicPath: `/dist/`,
      historyApiFallback: true,
      disableHostCheck: true,
      inline: true,
      hot: true,
      proxy: {
        '/mars': {
          target: 'http://118.25.68.71:8080',
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
        },
      //   '/zuul': {
      //     target: 'http://zdev.dian.so',
      //     changeOrigin: true,
      //     pathRewrite: {
      //       '^/zuul': '/',
      //     },
      //   },
      },
    },
    output: {
      path: path.join(__dirname, 'dist/'),
      filename: 'bundle.js',
      publicPath: `/dist/`,
      chunkFilename: '[hash]/[id].js',
    },
    plugins: baseConfig.plugins.concat([
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.ejs'),
        filename: '../index.html',
        icon: config.favicon,
        title: config.title,
        scripts: [
          // 打包时html script的路径
          // '//static.dian.so/static/lib/static/lib/vendor.v3.dll.js',
          '/dist/bundle.js',
        ],
        inject: false,
        minify: true,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackHarddiskPlugin(),
      new webpack.DllReferencePlugin({
        context: resolve(__dirname, '/'),
        manifest: require(resolve(
          __dirname,
          './public/vendor-v3-mainfest.json'
        )),
      }),
      // 定义变量
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          NODE_ENV: JSON.stringify('local'),
        },
        DEBUG: true,
      }),
      new OpenBrowserPlugin({
        url: config.domain,
      }),
    ]),
  })
})()
