module.exports = {
  plugins: [
    require('precss'),
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      stage: 3,
      browsers: [
        'Chrome >= 35',
        'ChromeAndroid >= 35',
        'iOS >= 8',
        'Android >= 4.1'
      ]
    }),
    require('cssnano')({
      preset: 'default',
      autoprefixer: false,
      reduceIdents: false,
      'postcss-zindex': false
    })
  ]
}
