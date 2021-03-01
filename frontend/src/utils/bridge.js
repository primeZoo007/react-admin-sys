import CONSTANTS from '../constants'
import userAgent from 'utils/userAgent'

const hackSyncWechatTitle = () => {
  var iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = '/favicon.ico'
  iframe.onload = () => {
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 10)
  }
  document.body.appendChild(iframe)
}

export const setTitle = title => {
  document.title = title || CONSTANTS.TITLE
  if (document.title && userAgent.device.isIOS) {
    hackSyncWechatTitle()
  }
}

const parseStr = (response, cb) => {
  if (typeof response === 'string') {
    response = JSON.parse(response)
  }
  return cb(response)
}

const setupWebViewJavascriptBridge = callback => {
  // Android使用
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }
}

// 扫码枪
const scanCode = cb => {
  console.log('要扫码了')
  setupWebViewJavascriptBridge(bridge => {
    console.log('正在扫码')
    return bridge.callHandler('scanCode', null, response => {
      console.log('扫码回来了', response)
      return parseStr(response, cb)
    })
  })
}
// 打印小票
const printOrder = (params, cb) => {
  console.log('准备打印订单')
  setupWebViewJavascriptBridge(bridge => {
    console.log('正在打印订单')
    return bridge.callHandler('printOrder', params, response => {
      return true
    })
  })
}

// 打印充值流水
const printCharge = (params, cb) => {
  console.log('准备打印充值流水')
  setupWebViewJavascriptBridge(bridge => {
    console.log('正在打印充值流水')
    return bridge.callHandler('printCharge', params, response => {
      return true
    })
  })
}

// 清除扫码枪回调函数
const clearScancode = () => {
  console.log('准备删除扫码枪回调函数了')
  setupWebViewJavascriptBridge(bridge => {
    console.log('正在删除')
    return bridge.callHandler('clearScancode', null, () => {
      console.log('删除回来了')
      return true
    })
  })
}

// 链接副屏
const screenLink = (params, cb) => {
  setupWebViewJavascriptBridge(bridge =>
    bridge.callHandler('screenLink', params, response => {
      return parseStr(response, cb)
    })
  )
}

// 关闭app
const closeApp = cb => {
  setupWebViewJavascriptBridge(bridge =>
    bridge.callHandler('closeApp', null, response => parseStr(response, cb))
  )
}

export default {
  scanCode,
  screenLink,
  closeApp,
  clearScancode,
  printOrder,
  printCharge,
}
