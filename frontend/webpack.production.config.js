const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.base.config')
const getConfig = require('./config')
const config = getConfig('production')
const { resolve } = require('path')
require('isomorphic-fetch')

module.exports = (async () => {
  return Object.assign({}, baseConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    output: {
      path: path.join(__dirname, `product/dist/${config.version}`),
      filename: 'bundle.js',
      publicPath: `${config.cpd}${config.version}/`,
      chunkFilename: '[hash]/[id].js',
    },
    plugins: baseConfig.plugins.concat([
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.ejs'),
        filename: '../../index.html',
        icon: config.favicon,
        title: config.title,
        scripts: config.scripts,
        inject: false,
        minify: true,
      }),
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
          NODE_ENV: JSON.stringify('production'),
        },
        DEBUG: false,
      }),
    ]),
  })
})()
