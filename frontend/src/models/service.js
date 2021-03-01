import action from 'actions/service'
import { saveData } from 'utils'
import { message } from 'antd'

export default {
  state: {
    modalVisible: false,
    tableLoading: true,
    serviceList: {
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
    // 获取服务列表
    async getServiceList (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getServiceList(params)
      if (res.success) {
        this.save({
          serviceList: res.data,
          tableLoading: false,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 新增服务
    async addService (params, state, cb) {
      this.save({
        addServiceRequest: null,
      })
      const res = await action.addService(params)
      if (res.success) {
        cb && cb(res)
      } else {
        cb && cb(res)
      }
    },
    // 编辑详情
    async editDetails (params) {
      const res = await action.editDetails(params)
      if (res.success) {
        this.save({
          eDetails: res.data,
        })
      }
    },
    // 编辑服务
    async editService (params) {
      const res = await action.editService(params)
      if (res.success) {
        message.success('编辑成功', 4)
        setTimeout(() => {
          location.href = '/beinoen/service/list'
        }, 1000)
      }
    },
    // 获取消费信息
    async getConsumerList (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getConsumerList(params)
      if (res.success) {
        this.save({
          consumerList: res.data,
          tableLoading: false,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 消费
    async consumer (params) {
      this.save({
        consumerRequest: false,
      })
      const res = await action.consumer(params)
      if (res.success) {
        this.save({
          consumerRequest: true,
        })
      }
    },
    // 消费列表
    async getList (params) {
      const res = await action.consumerList(params)
      if (res.success) {
        this.save({
          conList: res.data,
        })
      }
    },
    // 关闭服务
    async closeService (params) {
      this.save({
        closeRequest: false,
      })
      const res = await action.closeService(params)
      if (res.success) {
        this.save({
          closeRequest: true,
        })
      }
    },
    // 获取子屏消费信息
    async getChildService (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getChildService(params)
      if (res.success) {
        this.save({
          tableLoading: false,
          childService: res.data && res.data.list,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
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
