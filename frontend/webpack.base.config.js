const path = require('path')
const os = require('os')
const HappyPack = require('happypack')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length,
})

module.exports = {
  entry: {
    main: './src/main',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/react'),
          path.resolve(__dirname, 'node_modules/@rematch/core'),
          path.resolve(__dirname, 'node_modules/@rematch/immer'),
          path.resolve(__dirname, 'node_modules/@rematch/loading'),
          path.resolve(__dirname, 'src'),
        ],
        use: [
          {
            loader: 'happypack/loader?id=happybabel',
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules|antd\.css/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[local]--[hash:base64:5]',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules|antd\.css/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      actions: path.join(__dirname, 'src/actions'),
      components: path.join(__dirname, 'src/components'),
      constants: path.join(__dirname, 'src/constants'),
      containers: path.join(__dirname, 'src/containers'),
      models: path.join(__dirname, 'src/models'),
      utils: path.join(__dirname, 'src/utils'),
    },
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool,
      verbose: true,
    }),
  ],
}
