import action from 'actions/report.js'
import { saveData } from 'utils'

export default {
  state: {
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
    // 获取导购列表
    async querySaleList (params) {
      this.save({
        tableLoading: true,
      })
      let json = await action.queryAssistant(params)
      if (json && json.success) {
        // eslint-disable-next-line no-unused-vars
        let commodityAmount = 0
        // eslint-disable-next-line no-unused-vars
        let profitAmount = 0
        json.data.list.map(item => {
          commodityAmount += parseFloat(item.commodityPriceAmount)
          profitAmount += parseFloat(item.commondityProfit)
        })
        this.save({
          commodityAmount: commodityAmount.toFixed(2),
          profitAmount: profitAmount.toFixed(2),
          tableLoading: false,
          total: json.data.total,
          dataSource: json.data.list,
        })
      } else {
        this.save({
          tableLoading: false,
        })
      }
    },
  }),
}
