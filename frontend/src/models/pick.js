import action from 'actions/pick'
import { saveData } from 'utils'
import bridge from 'utils/bridge'

export default {
  state: {
    modalVisible: false,
    tableLoading: true,
    picks: {
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
    // 获取提货单信息
    async getList (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getList(params)
      if (res.success) {
        this.save({
          tableLoading: false,
          pickList: res.data,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 获取提货单详情
    async getDetails (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getDetails(params)
      if (res.success) {
        this.save({
          tableLoading: false,
          pickDetails: res.data,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 扫码
    async pickScan (params) {
      this.save({
        pickInfo: null,
      })
      const res = await action.pickScan(params)
      if (res.success) {
        this.handleBridge()
        this.save({
          pickInfo: res.data,
        })
      } else {
        this.handleBridge()
        this.save({
          pickInfo: null,
        })
      }
    },
    // 确认提货
    async confirmPick (params, state, cb) {
      const res = await action.confirmPick(params)
      if (res.success) {
        cb && cb()
      }
    },
    handleBridge () {
      bridge.scanCode(response => {
        console.log('扫码枪回调', response)
        this.pickScan({
          code: (response && response.url) || '',
        })
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
