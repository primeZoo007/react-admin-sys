import action from 'actions/system'
import { saveData } from 'utils'
import { message } from 'antd'

export default {
  state: {
    modalVisible: false,
    tableLoading: true,
    clerks: {
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
    // 获取店员信息
    async getClerks (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getClerks(params)
      if (res.success) {
        this.save({
          tableLoading: false,
          clerks: res.data,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 新增店员信息
    async addClerk (params) {
      const res = await action.addClerk(params)
      if (res.success) {
        message.success('新增成功', 4)
        this.getClerks({
          pageSize: 20,
          pageNo: 1,
        })
      }
    },
    // 删除店员信息
    async deleteClerk (params) {
      const res = await action.deleteClerk(params)
      if (res.success) {
        message.success('删除成功', 4)
        this.getClerks({
          pageSize: 20,
          pageNo: 1,
        })
      }
    },
    // 编辑店员信息
    async editClerk (params) {
      const res = await action.editClerk(params)
      if (res.success) {
        message.success('编辑成功', 4)
        this.getClerks({
          pageSize: 20,
          pageNo: 1,
        })
      }
    },
    // 重置密码
    async resetPassword (params) {
      const res = await action.resetPassword(params)
      if (res.success) {
        message.success('重置成功', 4)
        this.getClerks({
          pageSize: 20,
          pageNo: 1,
        })
      }
    },
    // 权限管理
    async authManage (params, state, cb) {
      this.save({
        powerRequest: false,
      })
      const res = await action.authManage(params)
      if (res.success) {
        this.save({
          powerRequest: true,
        })
        cb && cb()
      }
    },
    // 保存支付
    async savePay (params) {
      const res = await action.savePay(params)
      if (res.success) {
        message.success('保存成功', 4)
      }
    },
    // 获取二维码
    async getQrCode (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getQrCode(params)
      if (res) {
        this.save({
          tableLoading: false,
          qrCode: res.data,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 修改密码
    async editPassword (params) {
      const res = await action.editPassword(params)
      if (res.success) {
        message.success('修改成功', 4)
      }
    },
    // 权限管理
    async addPower (params) {
      const res = await action.authManage(params)
      if (res.success) {
        message.success('编辑成功', 4)
      }
    },
    // 获取h5code
    async getH5Code (params, state, cb) {
      const res = await action.getH5Code(params)
      if (res.success) {
        this.save({
          h5Code: res.data && res.data.url,
        })
        cb && cb()
      } else {
        cb && cb()
      }
    },
  }),
}
