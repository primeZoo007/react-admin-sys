import fetch from 'utils/fetch'

export default {
  // 获取应用
  getApplication (params) {
    return fetch.get('/dtracker/app/search', {
      params,
    })
  },
  // 新建应用
  createApplication (params) {
    return fetch.post('/dtracker/app/add', params)
  },
}
