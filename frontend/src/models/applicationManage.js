import action from 'actions/applicationManage'
import { saveData } from 'utils'
import { message } from 'antd'

export default {
  state: {
    modalVisible: false,
    tableLoading: false,
    applicationList: {
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
    // 获取应用数据
    async getApplication (params) {
      this.editTableLoading(true)
      action.getApplication(params).then(res => {
        this.save({ applicationList: res.data, tableLoading: false })
      })
    },
    // 创建应用
    async createApplication (params) {
      action.createApplication(params).then(res => {
        message.success('创建成功', 4)
        this.editModalVisible(false)
        this.getApplication({
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
