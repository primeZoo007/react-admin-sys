import action from 'actions/buryingPoints'
import { saveData } from 'utils'
import { message } from 'antd'

export default {
  state: {
    modalVisible: false,
    tableLoading: true,
    pointsList: {
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
    // 获取埋点
    async getPoints (params) {
      action.getPoints(params).then(res => {
        this.save({
          pointsList: res.data,
          tableLoading: false,
        })
      })
    },
    // 创建埋点
    async createPoints (params) {
      action.createPoints(params).then(res => {
        message.success('创建成功', 4)
        this.editModalVisible(false)
        this.getPoints({
          appId: params.appId,
          pageSize: 20,
          pageNo: 1,
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
