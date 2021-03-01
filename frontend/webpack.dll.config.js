const webpack = require('webpack')
const path = require('path')
const baseConfig = require('./webpack.base.config')

/**
  "@rematch/core": "^1.0.6",
  "@rematch/immer": "^1.1.0",
  "@rematch/loading": "^1.1.2",
  "axios": "^0.18.0",
  "classnames": "^2.2.6",
  "history": "^4.7.2",
  "nprogress": "^0.2.0",
  "prop-types": "^15.6.2",
  "react": "^16.5.2",
  "react-dom": "^16.5.2",
  "react-loadable": "^5.5.0",
  "react-redux": "^5.0.7",
  "react-router-dom": "^4.3.1",
  "redux": "^4.0.1",
 */
module.exports = Object.assign({}, baseConfig, {
  mode: 'production',
  entry: {
    vendor: [
      '@rematch/core',
      '@rematch/immer',
      '@rematch/loading',
      'axios',
      'classnames',
      'history',
      'nprogress',
      'prop-types',
      'react',
      'react-dom',
      'react-loadable',
      'react-redux',
      'react-router-dom',
      'redux',
    ],
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].v3.dll.js',
    /**
     * output.library
     * 将会定义为window.${output.library}
     * 在这次的例子中，将会定义为window.vendor_library
     */
    library: '[name]_library',
  },
  plugins: baseConfig.plugins.concat([
    new webpack.DllPlugin({
      /**
       * path
       * 定义 mainfest 文件生成的位置
       * [name]的部分由entry的名字替换
       */
      path: path.join(__dirname, 'public', '[name]-v3-mainfest.json'),
      /**
       * name
       * dll bundle 输出到那个全局变量上
       * 和 output.library一样即可
       */
      name: '[name]_library',
    }),
  ]),
})
