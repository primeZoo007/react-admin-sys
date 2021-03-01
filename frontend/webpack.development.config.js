const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.base.config')
const getConfig = require('./config')
const config = getConfig('development')
require('isomorphic-fetch')

module.exports = (async () => {
  let json
  try {
    let response = await fetch(config.mainfest)
    json = await response.json()
  } catch (error) {
    throw error
  }
  return Object.assign({}, baseConfig, {
    mode: 'production',
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: path.join(__dirname, `development/dist/${config.version}`),
      filename: 'bundle.js',
      publicPath: `${config.cpd}${config.version}/`,
      chunkFilename: '[hash]/[id].js',
    },
    plugins: baseConfig.plugins.concat([
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.ejs'),
        filename: '../index.html',
        // icon: config.favicon,
        title: config.title,
        scripts: config.scripts,
        inject: false,
        minify: true,
      }),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: json,
      }),
      // 定义变量
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          NODE_ENV: JSON.stringify('development'),
        },
        DEBUG: true,
      }),
    ]),
  })
})()
