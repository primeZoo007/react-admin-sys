import fetch from 'utils/fetch'

export default {
  // 获取埋点
  getPoints (params) {
    return fetch.get('/dtracker/point/search', {
      params,
    })
  },
  // 新建埋点
  createPoints (params) {
    return fetch.post('/dtracker/point/add', params)
  },
}
