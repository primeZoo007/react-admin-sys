const fs = require('fs')

module.exports = function (env) {
  let json = fs.readFileSync('package.json', {
    encoding: 'utf-8',
  })
  const name = JSON.parse(json).name
  const version = JSON.parse(json).version

  const config = {
    name: name,
    title: '门店系统', // 中文标题
    favicon: '/favicon.ico', // favicon的访问地址
    mainfest: '//static.dian.so/static/lib/static/lib/vendor-v3-mainfest.json', // npm run dll 生成的文件访问地址
    scripts: [
      // '//static.dian.so/static/lib/static/lib/vendor.v3.dll.js', // 开发环境
      '/public/vendor.v3.dll.js', // 线上
    ],
  }
  switch (env) {
    case 'local':
      config.port = 3186 // webpack开发端口号
      config.host = '0.0.0.0'
      config.domain = 'http://www.shop-manamge.com' // 项目域名 webpack打开浏览器时的访问地址
      config.version = 'local'
      config.scripts.push('/dist/bundle.js')
      break
    case 'development':
      config.version = 'development'
      config.scripts.push('/dist/bundle.js')
      break
    case 'production':
      config.version = version
      config.cpd = '/dist/' // npm run pro 生成的版本代码存放的访问目录
      config.scripts.push(`${config.cpd}${config.version}/bundle.js`)
      break
  }
  return config
}
