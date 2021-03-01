import action from 'actions/shop'
import orderAction from 'actions/order'
import { saveData } from 'utils'
import { message } from 'antd'
import bridge from 'utils/bridge'

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
    // 创建分类
    async createCategory (params) {
      const res = await action.createCategory(params.values)
      if (res.success) {
        message.success('操作成功', 4)
        this.getCategory1({ data: res.data, key: params.key })
      }
    },
    async getCategory1 (params, state) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getCategory({})
      if (res.success) {
        if (params.key === 'first') {
          const arr = JSON.parse(JSON.stringify(state.shop.fircategory))
          arr.push(params.data)
          this.save({
            tableLoading: false,
            category: res.data,
            fircategory: arr,
          })
        } else if (params.key === 'sec') {
          const arr = JSON.parse(JSON.stringify(state.shop.seccategory))
          arr.push(params.data)
          this.save({
            tableLoading: false,
            category: res.data,
            seccategory: arr,
          })
        } else if (params.key === 'thi') {
          const arr = JSON.parse(JSON.stringify(state.shop.seccategory))
          arr.push(params.data)
          this.save({
            tableLoading: false,
            category: res.data,
            seccategory: arr,
          })
        } else {
          this.save({
            tableLoading: false,
            category: res.data,
            fircategory: [],
            seccategory: [],
          })
        }
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    resetCategory () {
      this.save({
        fircategory: [],
        seccategory: [],
      })
    },
    resetDetailCategory (params, state) {
      const obj = Object.assign({}, state.shop.editDetail)
      obj.firstCategoryName = undefined
      obj.secondCategoryName = undefined
      obj.thirdCategoryName = undefined
      obj.firstCategoryId = undefined
      obj.secondCategoryId = undefined
      obj.thirdCategoryId = undefined
      obj.categoryId = undefined
      obj.categoryName = undefined
      this.save({
        editDetail: obj,
      })
    },
    // 获取分类
    async getCategory (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getCategory(params)
      if (res.success) {
        this.save({
          tableLoading: false,
          category: res.data,
          // fircategory: [],
          // seccategory: [],
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    async getfirCategory (params) {
      this.save({
        tableLoading: true,
        fircategory: [],
      })
      const res = await action.getCategory(params)
      if (res.success) {
        this.save({
          tableLoading: false,
          fircategory: res.data,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    resetfirCategory () {
      this.save({
        fircategory: [],
      })
    },
    async getsecCategory (params) {
      this.save({
        tableLoading: true,
        seccategory: [],
      })
      const res = await action.getCategory(params)
      if (res.success) {
        this.save({
          tableLoading: false,
          seccategory: res.data,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    resetsecCategory () {
      this.save({
        seccategory: [],
      })
    },
    // 编辑分类
    async editCategory (params) {
      const res = await action.editCategory(params.values)
      if (res.success) {
        message.success('操作成功', 4)
        this.getCategory2({
          data: res.data,
          key: params.key,
          index: params.editIndex,
        })
      }
    },
    async getCategory2 (params, state) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getCategory({})
      if (res.success) {
        if (params.key === 'first') {
          const arr = JSON.parse(JSON.stringify(state.shop.category))
          arr[params.index] = params.data
          // arr.push(params.data)
          this.save({
            tableLoading: false,
            category: res.data,
            // fircategory: arr,
          })
        } else if (params.key === 'sec') {
          const arr = JSON.parse(JSON.stringify(state.shop.fircategory))
          // arr.push(params.data)
          arr[params.index] = params.data
          this.save({
            tableLoading: false,
            category: res.data,
            fircategory: arr,
          })
        } else if (params.key === 'thi') {
          const arr = JSON.parse(JSON.stringify(state.shop.seccategory))
          // arr.push(params.data)
          arr[params.index] = params.data
          this.save({
            tableLoading: false,
            category: res.data,
            seccategory: arr,
          })
        } else {
          this.save({
            tableLoading: false,
            category: res.data,
            fircategory: [],
            seccategory: [],
          })
        }
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 获取自有商品信息
    async getOwnGoods (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getOwnGoods(params)
      if (res.success) {
        this.save({
          ownGoods: res.data,
          tableLoading: false,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 删除自有商品
    async deleteOwnGoods (params, state, cb) {
      const res = await action.deleteOwnGoods(params)
      if (res.success) {
        cb && cb()
      }
    },
    // 添加自有商品
    async addOwnGoods (params, state, cb) {
      const res = await action.addOwnGoods(params)
      if (res.success) {
        cb && cb(res)
      } else {
        cb && cb(res)
      }
    },
    // 获取编辑详情
    async getEditDetails (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getEditDetails(params)
      if (res.success) {
        this.save({
          tableLoading: false,
          editDetail: res.data,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 编辑自有商品信息
    async editOwnGoods (params, state, cb) {
      const res = await action.editOwnGoods(params)
      if (res.success) {
        cb && cb(res)
      } else {
        cb && cb(res)
      }
    },
    // 获取百诺恩商品信息
    async getBainuoenGoods (params) {
      this.save({
        tableLoading: true,
      })
      const res = await action.getBainuoenGoods(params)
      if (res.success) {
        this.save({
          bainuoenGoods: res.data,
          tableLoading: false,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
    // 编辑百诺恩商品信息
    async editBainuoenGoods (params) {
      action.editBainuoenGoods(params).then(res => {})
    },
    // 获取百诺恩商品分类
    async getBainuoen (params) {},
    // 获取规格
    async getGuige () {
      const res = await action.getGuige()
      if (res.success) {
        this.save({
          norm: res.data,
        })
      }
    },
    deleteInfo (data, state) {
      let obj = Object.assign({}, state.shop.editDetail)
      obj.specPriceList = data
      this.save({
        editDetail: obj,
      })
    },
    editInfo (data, state) {
      let obj = Object.assign({}, state.shop.editDetail)
      obj.specPriceList = data
      this.save({
        editDetail: obj,
      })
    },

    addInfo (data, state) {
      let obj = Object.assign({}, state.shop.editDetail)
      obj.specPriceList = data.concat(obj.specPriceList)
      this.save({
        editDetail: obj,
      })
    },
    // 根据条形码获取商品信息
    async getGoods (params) {
      this.save({
        goodsRequest: false,
        goods: null,
      })
      const res = await orderAction.getGoods(params)
      if (res.success) {
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
    handleBridge () {
      bridge.scanCode(response => {
        console.log('扫码枪回调', response)
        this.getBainuoenGoods({
          pageNo: 1,
          pageSize: 6,
          barcode: (response && response.url) || '',
        })
        this.getGoods({
          barcode: (response && response.url) || '',
        })
      })
    },
  }),
}
