import React from 'react'
import ReactDOM from 'react-dom'
import App from 'containers/app'
import { Provider } from 'react-redux'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import './main.css'
import store from './store'

/* eslint-disable no-extend-native */
Number.prototype.add = function (arg2) {
  let arg1 = this
  let r1, r2, m, c
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  c = Math.abs(r1 - r2)
  m = Math.pow(10, Math.max(r1, r2))
  if (c > 0) {
    let cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}

Number.prototype.sub = function (arg2) {
  let arg1 = this
  let r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = r1 >= r2 ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

Number.prototype.mul = function (arg2) {
  let arg1 = this
  let m = 0
  let s1 = arg1.toString()
  let s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  )
}

Number.prototype.div = function (arg2) {
  let arg1 = this
  let t1 = 0
  let t2 = 0
  let r1, r2
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {}
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

/* eslint-enalbe no-extend-native */

// 注意事项：伪类伪元素后面content内容需要加上!important
const init = () => {
  ReactDOM.render(
    <Provider store={store}>
      <LocaleProvider locale={zhCN}>
        <App />
      </LocaleProvider>
    </Provider>,
    document.getElementById('root')
  )
}

// It is most likely that you see this error because you updated to Redux 2.x and React Redux 2.x which no longer hot reload reducers automatically
// https://github.com/reactjs/react-redux/releases/tag/v2.0.0
// if (module.hot) {
//   module.hot.accept(() => {
//     init()
//   })
// }

init()
