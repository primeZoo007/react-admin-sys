import action from 'actions/store'
import { saveData } from 'utils'
import { message } from 'antd'

export default {
  state: {
    modalVisible: false,
    tableLoading: true,
    stocks: {
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
    async getWaterDetails (params) {
      const res = await action.getWaterDetails(params)
      if (res.success) {
        this.save({ waterDetails: res.data })
      }
    },
    // 库存流水
    async getStoreWater (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getStoreWater(params)
      console.log(res)
      if (res.success) {
        this.save({ tableLoading: false, storeWater: res.data.list || [], waterTotal: res.data.total })
      } else {
        this.save({ tableLoading: false })
      }
    },
    // 获取自有商品入库信息
    async getGoodsStore (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getGoodsStore(params)
      if (res.success) {
        this.save({ tableLoading: false, stocks: res.data })
      } else {
        this.save({ tableLoading: false })
      }
    },
    // 获取自有商品入库详情
    async getGoodsStoreDetails (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getGoodsStoreDetails(params)
      if (res.success) {
        this.save({ tableLoading: false, details: res.data })
      } else {
        this.save({ tableLoading: false })
      }
    },
    // 编辑自有商品入库信息
    async editGoodsStore (params) {
      this.save({
        editRequest: false,
      })
      const res = await action.editGoodsStore(params)
      if (res.success) {
        this.save({
          editRequest: true,
        })
      }
    },
    // 新增自有商品
    async addGoods (params) {
      const res = await action.addGoods(params)
      if (res.success) {
        message.success('入库成功', 4)
        location.reload()
      }
    },
    // 获取百诺恩商品入库信息
    async getBainuoenStore (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getBainuoenStore(params)
      if (res.success) {
        this.save({ tableLoading: false })
      } else {
        this.save({ tableLoading: false })
      }
    },
    // 获取百诺恩商品入库详情
    async getBainuoenDetails (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getBainuoenDetails(params)
      if (res.success) {
        this.save({ tableLoading: false })
      } else {
        this.save({ tableLoading: false })
      }
    },
    // 编辑百诺恩
    async editBainuoen (params, state, cb) {
      const res = await action.editBainuoen(params)
      if (res.success) {
        cb && cb()
      }
    },
    handleEdit (details) {
      this.save({
        details,
      })
    },
    async editTableLoading (params) {
      this.save({
        tableLoading: params,
      })
    },
    async editModalVisible (params) {
      this.save({
        modalVisible: params,
      })
    },
  }),
}
