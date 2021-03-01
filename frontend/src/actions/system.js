import fetch from 'utils/fetch'

export default {
  // 获取店员信息
  getClerks (params) {
    return fetch.get('/mars/clerk/searchClerkByCreateOrder', {
      params,
    })
  },
  // 新增店员信息
  addClerk (params) {
    return fetch.post('/mars/clerk/add', params)
  },
  // 删除店员
  deleteClerk (params) {
    return fetch.post('/mars/clerk/delete', params)
  },
  // 编辑店员
  editClerk (params) {
    return fetch.post('/mars/clerk/edit', params)
  },
  // 重置密码
  resetPassword (params) {
    return fetch.post('/mars/clerk/resetPassword', params)
  },
  // 权限管理
  authManage (params) {
    return fetch.post('/mars/clerk/rights/edit', params)
  },
  // 保存支付
  savePay (params) {
    return fetch.post('/mars/shop/saveQrImg', params)
  },
  // 获取二维码
  getQrCode (params) {
    return fetch.get('/mars/shop/qrImg', {
      params,
    })
  },
  // 修改密码
  editPassword (params) {
    return fetch.post('/mars/clerk/changePassword', params)
  },
  // 获取h5码
  getH5Code (params) {
    return fetch.get('/mars/shop/editQrImg/mobileUrl', {
      params,
    })
  },
}
