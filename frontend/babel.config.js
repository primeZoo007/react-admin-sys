module.exports = function (api) {
  api.cache(true)
  const presets = [
    [
      '@babel/preset-env',
      {
        debug: true,
        targets: {
          chrome: '35',
          ios: '8',
          android: '4.1',
          browsers: [
            'Chrome >= 35',
            'ChromeAndroid >= 35',
            'iOS >= 8',
            'Android >= 4.1',
          ],
        },
        useBuiltIns: 'usage',
        modules: 'commonjs',
      },
    ],
    '@babel/preset-react',
  ]
  const plugins = [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
    ['@babel/plugin-proposal-class-properties'],
    ['syntax-dynamic-import'],
  ]
  return {
    presets,
    plugins,
  }
}
