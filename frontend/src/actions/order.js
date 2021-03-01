import fetch from 'utils/fetch'

export default {
  // 300 会员调用的接口
  queryNewMember (params) {
    return fetch.post('/mars/commodity/recalculationCommodityPrice', params)
  },
  // 查询手机号是否为300会员
  queryTel (params) {
    return fetch.post('/mars/member/isBenThreeHundredMember', params)
  },
  // 查询余额的接口
  getBalance (params) {
    return fetch.post('/mars/member/getBalance', params)
  },
  // 获取商品优惠
  getPreferentialInfo (params) {
    return fetch.post('/mars/order/getPreferentialInfo', params)
  },
  // 模糊查询手机号码
  getTelList (params) {
    return fetch.post('/mars/member/searchByMobile', params)
  },
  // 获取订单
  getOrder (params) {
    return fetch.get('/mars/order/search', {
      params,
    })
  },
  // 获取子订单
  getOrderItem (params) {
    return fetch.get('/mars/order/detail', {
      params,
    })
  },
  // 订单详情
  orderDetail (params) {
    return fetch.get('/mars/order/detail', {
      params,
    })
  },
  // 创建订单
  createOrder (params) {
    return fetch.post('/mars/order/create', params)
  },
  // 生成订单
  generateOrder (params) {
    return fetch.post('', params)
  },
  // 根据条形吗获取商品信息
  getGoods (params) {
    return fetch.get('/mars/commodity/queryByBarcode', {
      params,
    })
  },
  // 更新订单状态
  updateOrder (params) {
    return fetch.post('/mars/order/pay', params)
  },
  // 取消订单
  orderCancel (params) {
    return fetch.post('/mars/order/cancel', params)
  },
  getCommdity (params) {
    return fetch.get('/mars/commodity/searchForOrder', { params })
  },
}
