## 事件绑定

1. 新增以下全局方法供使用

`window.showToast`

`window.showError`

`window.showLoading`

`window.hideLoading`

`window.showSuccess`

`window.showModal`

`window.showDialog`

`window.showPageError`

`window.showPageLogin`

2. Number 原型添加以下方法

`Number(1).add(1)`
`Number(1).sub(1)`
`Number(1).mul(1)`
`Number(1).div(1)`

## 安装步骤

1. 安装依赖

进入目录

`npm install`

(如果没有墙，请使用淘宝镜像或使用 cnpm 安装)

淘宝镜像安装

`npm install --registry https://registry.npm.taobao.org`

2. 项目配置

- 打开 config.js 文件

例子： 比如 您的域名为: http://m.domain.com cdn 为: http://g.domain.com
建议您安装以下例子来配置您的项目，您只需要修改一级域名即可

```
const packageConfig = require(`./package.json`)

module.exports = function(env) {
  const config = {
    name: packageConfig.name,
    title: '无题', // 中文标题
    favicon: '//g.domain.com/release/fedhm/favicon.ico', // favicon的访问地址
    // https://github.com/hisanshao/viewport/blob/master/viewport-units-buggyfill-and-hacks.min.js
    hacks: '//g.domain.com/lib/viewport-units-buggyfill-and-hacks.min.js', // viewport兼容性库文件
    mainfest: 'http://g.domain.com/lib/vendor-mainfest.json', // npm run dll 生成的文件访问地址
    scripts: [
      '//g.domain.com/lib/vendor.dll.js' // npm run dll 生成的文件访问地址
    ]
  }
  switch (env) {
    case 'local':
      config.port = 3001 // webpack开发端口号
      config.host = '0.0.0.0'
      config.domain = 'http://m.domain.com' // 项目域名 webpack打开浏览器时的访问地址
      config.version = 'local'
      config.scripts.push('/dist/bundle.js')
      break
    case 'development':
      config.version = 'development'
      config.scripts.push('/dist/bundle.js')
      break
    case 'production':
      config.version = packageConfig.version
      config.cpd = '//g.domain.com/release/fedhm/' // npm run pro 生成的版本代码存放的访问目录
      config.scripts.push(`${config.cpd}${config.version}/bundle.js`)
      break
  }
  return config
}
```

- 打开 src/utils/bridge.js 文件

修改 iframe.src = '//g.domain.com/release/fedhm/favicon.ico' // favicon 的访问地址

- 修改 src/constants/index.js 文件

修改 title: '无题', // 中文标题

3. 本地环境启动

npm run local

4. 开发环境发布

npm run dev

5. 线上环境发布

npm run pro

## 命名规范

#### 服务端返回结构规范

```
{
  success: true,
  data: null
}
```

```
{
  success: false,
  code: '',
  msg: ''
}
```

#### 目录结构

```
actions:
  mall.js
models
  index.js
  mall/list.js
  mall/details.js
constants
  index.js
containers
  mall/list.js
  mall/details.js
utils
  index.js
  request.js
```

#### 命名要求

actions:

- 添加注释
- 方法名前缀（get、update、delete、create）
- 结构
  ```
    export default {
      // 查询。。。。
      getXXX() {},
      // 删除。。。。
      deleteXXX() {},
      // 更新。。。。
      updateXXX() {},
      // 创建。。。。
      createXXX() {}
    }
  ```

models:

- 禁止 return 数据到 container，数据必须通过 reducer 传递出去

constants

- 静态值都用大写字母加下划线定义

containers

- 方法顺序

```
  class {
    // 构造函数
    constructor() {}
    // 事件绑定函数
    handleXXX() {}
    // 私有函数
    _XXX() {}
    // 生命周期函数
    componentDidMount() {}
    // 生命周期函数
    componentWillReceiveProps() {}
    // 生命周期函数
    render() {}
    // 生命周期函数
    componentWillUnmount() {}
    // render扩展函数
    renderXXX() {}
  }
```

- 服务端返回的数据存储在 store(即使和页面不想关也存在这)，通过 this.props 访问，通过 dispatch.updateList()更新 list
- this.state 来存储和页面相关的数据（除 this.props 数据外），this.setState()来更新状态
- this.xxx 来存储和页面不想关的数据

#### 文件命名

- 目录及文件名称均小写字母开头，驼峰式

#### css 命名

- 请使用语义化单词，双单词链接请使用'-',不要使用'\_'，或驼峰式命名
- 使用 class(.classname)而尽量不使用或少使用 id(#idname)

#### js 变量，函数命名

- 函数命名请使用语义化单词，并使用驼峰式命名
- 变量命名同上，如有特殊含义可在前加特殊'\$'等
- 函数如有参数，请添加参数注释

## 代码风格

- 所有项目 eslint 风格均使用 standard 标准
- 要求使用 vscode 编译器，安装插件 eslint prettier postcss-sugarss-language

## 测试期间 bug 修复 以及 发布规范

- 本地代码 merge 至 dev
- bug 修复请在本地分支修改，然后重新 merge 至 dev
- 上线时请将本地已测试完毕的分支代码 merge 至 master
- 多版本功能上线，若非其他特殊因素限制，请务必拆分上线
