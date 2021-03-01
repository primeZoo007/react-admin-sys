import action from 'actions/member'
import { saveData } from 'utils'

export default {
  state: {
    modalVisible: false,
    tableLoading: true,
    members: {
      list: [],
      total: 1,
    },
  },
  reducers: {
    save (state, payload) {
      return saveData(state, payload)
    },
  },
  effects: dispatch => ({
    // 获取交易流水详情
    async getDetailWater (params) {
      this.save({
        tableLoading: false,
      })
      const res = await action.getDetailWater(params)
      if (res.success) {
        this.save({
          detailsContent: res.data,
          tableLoading: false,
        })
        return res
      }
    },
    // 会员充值
    async handleRecharge (params, cb) {
      const res = await action.handleRecharge(params)
      // eslint-disable-next-line eqeqeq
      if (res.success) {
        return res
      }
    },
    // 删除交易流水
    async deleteWaterDetail (params) {
      const res = await action.deleteWaterDetail(params)
      // eslint-disable-next-line eqeqeq
      if (res.success) {
        return res
      }
    },
    // 获取交易流水
    async getWaterDetail (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getWaterDetail(params)
      // eslint-disable-next-line eqeqeq
      if (res.success) {
        this.save({
          tableLoading: false,
          total: res.total,
          waterDetails: res.data.list || [],
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 获取会员
    async getMembers (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getMembers(params)
      if (res.success) {
        this.save({
          tableLoading: false,
          members: res.data,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 新增会员
    async addMember (params, state, cb) {
      const res = await action.addMember(params)
      if (res.success) {
        cb && cb(res)
      } else {
        cb && cb(res)
      }
    },
    // 新增百诺恩会员
    async addBainuoenMember (params, state, cb) {
      const res = await action.addBainuoenMember(params)
      if (res.success) {
        cb && cb(res)
      } else {
        cb && cb(res)
      }
    },
    // 编辑会员
    async editMember (params, state, cb) {
      const res = await action.editMember(params)
      if (res.success) {
        cb && cb(res)
      } else {
        cb && cb(res)
      }
    },
    // 会员失效
    async updateMember (params, stats, cb) {
      const res = await action.updateMember(params)
      if (res.success) {
        cb && cb()
      } else {
        cb && cb()
      }
    },
  }),
}
