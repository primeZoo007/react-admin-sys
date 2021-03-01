import fetch from 'utils/fetch'

export default {
  firstMouned (params) {
    return fetch.post('/mars/getErrorPwdCount', params)
  },
  changePass (params) {
    return fetch.post('/mars/clerk/changePassword', params)
  },
  // 登录
  createLogin (params) {
    return fetch.post('/mars/clerk/login', params)
  },
  // 获取省份
  getProvince (params) {
    return fetch.get('/mars/common/area', { params })
  },
  // 获取市
  getCity (params) {
    return fetch.get('/mars/common/area', { params })
  },
  // 获取区
  getArea (params) {
    return fetch.get('/mars/common/area', { params })
  },
  deleteLogout () {},
}
