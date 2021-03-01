import fetch from 'utils/fetch'

export default {
  // 获取提货单
  getList (params) {
    return fetch.get('/mars/outstock/search', {
      params,
    })
  },
  // 获取提货单详情
  getDetails (params) {
    return fetch.get('/mars/outstock/detail', { params })
  },
  // 扫码
  pickScan (params) {
    return fetch.get('/mars/outstock/scanCode', { params })
  },
  // 确认提货
  confirmPick (params) {
    return fetch.post('/mars/outstock/confirm', params)
  },
  // 获取子屏提货信息
  getCustomerPick (params) {
    return fetch.get('', { params })
  },
}
