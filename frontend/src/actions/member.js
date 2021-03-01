import fetch from 'utils/fetch'

export default {
  getDetailWater (params) {
    return fetch.post('/mars/member/tradeWaterDetail', params,
    )
  },
  // 会员充值
  handleRecharge (params) {
    return fetch.post('/mars/member/recharge', params,
    )
  },
  // 删除流水
  deleteWaterDetail (params) {
    return fetch.post('/mars/member/tradeWaterDelete', params,
    )
  },
  // 获取交易流水
  getWaterDetail (params) {
    return fetch.post('/mars/member/tradeWater', params,
    )
  },
  // 获取会员信息
  getMembers (params) {
    return fetch.get('/mars/member/memberSearch', {
      params,
    })
  },
  // 新增会员
  addMember (params) {
    return fetch.post('/mars/member/add', params)
  },
  // 新增百诺恩会员
  addBainuoenMember (params) {
    return fetch.post('/mars/member/bne/add', params)
  },
  // 编辑会员
  editMember (params) {
    return fetch.post('/mars/member/edit', params)
  },
  // 会员失效
  updateMember (params) {
    return fetch.post('/mars/member/invalid', params)
  },
}
