import fetch from 'utils/fetch'

export default {
  // 获取服务列表
  getServiceList (params) {
    return fetch.get('/mars/activity/searchByCreateOrder', {
      params,
    })
  },
  // 新增服务
  addService (params) {
    return fetch.post('/mars/activity/add', params)
  },
  // 编辑服务
  editService (params) {
    return fetch.post('/mars/activity/edit', params)
  },
  // 获取编辑详情
  editDetails (params) {
    return fetch.get('/mars/activity/detail', { params })
  },
  // 获取消费信息
  getconsumer (params) {
    return fetch.post('/mars/activity/detail', params)
  },
  // 获取消费列表
  getConsumerList (params) {
    return fetch.get('/mars/activity/order/search', { params })
  },
  // 消费
  consumer (params) {
    return fetch.post('/mars/activity/consumption', params)
  },
  // 获取消费列表
  consumerList (params) {
    return fetch.get('/mars/activity/consumption/list', { params })
  },
  // 关闭服务
  closeService (params) {
    return fetch.post('/mars/activity/close', params)
  },
  // 获取子屏消费信息
  getChildService (params) {
    return fetch.get('/mars/activity/order/search', { params })
  },
}
