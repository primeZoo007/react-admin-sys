import commonActions from 'actions/common'
import { setItem, removeItem } from 'utils/storage'
import { saveData } from 'utils'
export default {
  state: {}, // initial state
  reducers: {
    _logout (state) {
      return state
    },
    save (state, payload) {
      return saveData(state, payload)
    },
  },
  effects: dispatch => ({
    async firstMouned (params) {
      const data = await commonActions.firstMouned(params)
      return data
    },
    async deleteLogout () {
      removeItem('lhcSid')
      location.href = '/login'
    },
    // 登录
    async createLogin (params) {
      const data = await commonActions.createLogin(params)
      if (!data.success && data.code === '103') {
        return data
      } else if (data.success && !data.data.weakPasswordFlag) {
        setItem('clerkName', data.data.clerkName || '')
        setItem('shopName', data.data.shopName || '')
        setItem('lhcSid', data.data.token || '')
        setItem('power', data.data.power || [])
        setItem('headPower', data.data.headerPower || [])
        location.href = '/beinoen/ad'
        return true
      } else if (!data.success) {
        return data
      } else if (data.data.weakPasswordFlag) {
        setItem('clerkName', data.data.clerkName || '')
        setItem('shopName', data.data.shopName || '')
        setItem('lhcSid', data.data.token || '')
        setItem('power', data.data.power || [])
        setItem('headPower', data.data.headerPower || [])
        return data
      }
    },
    // 修改密码
    async changePass (params) {
      const data = await commonActions.changePass(params)
      if (data.success) {
        return true
      } else {
        return false
      }
    },
    // 获取用户信息
    async getUserInfo (params) {
      const res = await commonActions.getUserInfo(params)
      if (res) {
        this.save({
          userInfo: res.data,
        })
      }
    },
    // 获取省份
    async getProvince (params) {
      const res = await commonActions.getProvince(params)
      this.save({
        province: res.data,
      })
    },
    // 获取城市
    async getCity (params) {
      const res = await commonActions.getCity(params)
      this.save({
        city: res.data,
      })
    },
    // 获取区域
    async getArea (params) {
      const res = await commonActions.getArea(params)
      this.save({
        area: res.data,
      })
    },
  }),
}
