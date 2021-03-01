import action from 'actions/order'
import { saveData } from 'utils'
import bridge from 'utils/bridge'
import { message } from 'antd'

export default {
  state: {
    modalVisible: false,
    tableLoading: true,
    orders: {
      list: [],
      total: 1,
    },
    selectedRow: [],
  },
  reducers: {
    save (state, payload) {
      return saveData(state, payload)
    },
  },
  effects: dispatch => ({
    async queryNewMember (parmas) {
      const res = await action.queryNewMember(parmas)
      if (res.success) {
        return res
      }
    },
    async queryTel (params) {
      const res = await action.queryTel(params)
      if (res.success) {
        return res
      }
    },
    async getBalance (params) {
      try {
        const res = await action.getBalance(params)
        if (res.success) {
          if (res.data.isMember) {
            this.save({
              isMember: 'block',
              balace: res.data.balance,
            })
          } else {
            this.save({
              isMember: 'none',
            })
          }
        } else {
          this.save({
            isMember: 'none',
          })
        }
      } catch (e) {
        this.save({
          isMember: 'none',
        })
      }
    },
    // 获取订单信息
    async getOrder (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getOrder(params)
      if (res.success) {
        this.save({
          tableLoading: false,
          orders: res.data,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 获取订单组合优惠
    async getPreferentialInfo (params) {
      const json = await action.getPreferentialInfo(params)
      if (json.success) {
        let m = []
        // eslint-disable-next-line eqeqeq
        if (json.data.combinationPreferentialModels && json.data.combinationPreferentialModels.length != 0) {
          json.data.combinationPreferentialModels.map(item => {
            m.push(item.id)
          })
          this.save({
            display: 'block',
            showFlag: true,
            idList: m,
            saveAmountStr: json.data.saveAmountStr,
            saveAmount: json.data.saveAmount,
          })
          return json
        } else {
          this.save({
            display: 'none',
            showFlag: false,
            idList: [],
            saveAmountStr: '',
            saveAmount: '',
          })
          return json
        }
      }
    },
    async getTelList (params) {
      const res = await action.getTelList(params)
      return res
    },
    async orderDetail (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.orderDetail(params)
      if (res.success) {
        this.save({
          tableLoading: false,
          details: res.data,
        })
        return res
      }
    },
    // 获取子订单信息
    async getOrderItem (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getOrderItem(params)
      if (res.success) {
        this.save({
          orderItem: res.data,
          tableLoading: false,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 创建订单
    async createOrder (params, state, cb) {
      const res = await action.createOrder(params)
      if (res.success) {
        cb && cb(res)
        bridge.screenLink(
          JSON.stringify({
            url: `/customer/order/${res.data.orderId}`,
          })
        )
      } else {
        cb && cb(res)
      }
    },
    // 生成订单
    async generateOrder (params) {
      const res = await action.generateOrder(params)
      if (res.success) {
        message.success('订单已生成', 4)
      }
    },
    // 根据条形码获取商品信息
    async getGoods (params) {
      this.save({
        goodsRequest: false,
        goods: null,
      })
      const res = await action.getGoods(params)
      if (res.success) {
        res.data['subOrderDiscount'] = 10.00
        res.data['subOrderReceivableAmount'] = (res.data.memberPrice * 1).toFixed(2)
        this.handleBridge()
        this.save({
          goods: res.data,
          goodsRequest: true,
        })
      } else {
        this.handleBridge()
        this.save({
          goodsRequest: false,
        })
      }
    },
    // 更新订单状态
    async updateOrder (params) {
      this.save({
        updateRequest: false,
      })
      const res = await action.updateOrder(params)
      if (res.success) {
        this.save({
          updateRequest: true,
        })
      }
    },
    handleBridge () {
      bridge.scanCode(response => {
        console.log('扫码枪回调', response)
        this.getGoods({
          barcode: (response && response.url) || '',
          memberId: window.localStorage.getItem('orderAddMemberId'),
        })
      })
    },
    // 取消订单
    async orderCancel (params, state, cb) {
      const res = await action.orderCancel(params)
      if (res.success) {
        cb && cb()
      }
    },
    // 商品搜索
    async getCommdity (params, state) {
      this.save({
        commdityLoading: true,
      })
      // const arr = JSON.parse(JSON.stringify(state.order.selectedRow))
      const res = await action.getCommdity(params)
      if (res.data.list) {
        res.data.list.map(item => {
          item['subOrderDiscount'] = 10.00
          item['subOrderReceivableAmount'] = (item.memberPrice * 1).toFixed(2)
        })
      }
      if (res.success) {
        // const selectedRowKeys = filter(arr, (res.data && res.data.list) || [])
        this.save({
          commdityLoading: false,
          commdity: (res.data && res.data.list) || [],
          commdityTotal: (res.data && res.data.total) || 0,
          // selectedRowKeys,
        })
      } else {
        this.save({
          commdityLoading: false,
        })
      }
    },
    updateSelectedRowKeys (param, state, cb) {
      const arr = JSON.parse(JSON.stringify(state.order.selectedRow))
      this.save({
        selectedRowKeys: param.selectedRowKeys,
        selectedRow: param.selectedRow.concat(arr),
      })
      cb && cb()
    },
    resetCommdity () {
      this.save({
        selectedRowKeys: [],
        selectedRow: [],
        commdity: [],
        commdityTotal: 0,
      })
    },
  }),
}
