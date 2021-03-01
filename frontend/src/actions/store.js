import fetch from 'utils/fetch'

export default {
  // 库存流水详情
  getWaterDetails (params) {
    return fetch.get('/mars/stockWater/detail', {
      params,
    })
  },
  // 获取库存流水信息
  getStoreWater (params) {
    return fetch.get('/mars/stockWater/search', {
      params,
    })
  },
  // 获取自有商品入库信息
  getGoodsStore (params) {
    return fetch.get('/mars/bneInstock/search', {
      params,
    })
  },
  // 获取自有商品入库详情
  getGoodsStoreDetails (params) {
    return fetch.get('/mars/bneInstock/detail', {
      params,
    })
  },
  // 编辑自有商品入库信息
  editGoodsStore (params) {
    return fetch.post('/mars/instock/edit', params)
  },
  // 新增自有商品
  addGoods (params) {
    return fetch.post('/mars/instock/create', params)
  },
  // 获取百诺恩商品入库信息
  getBainuoenStore (params) {
    return fetch.get('', {
      params,
    })
  },
  // 获取百诺恩商品入库详情
  getBainuoenDetails (params) {
    return fetch.get('', {
      params,
    })
  },
  // 编辑百诺恩
  editBainuoen (params) {
    return fetch.post('/mars/commodity/bne/edit', params)
  },
}
