import fetch from 'utils/fetch'

export default {
  // 获取自有商品信息
  getOwnGoods (params) {
    return fetch.get('/mars/commodity/queryByCreateOrder', {
      params,
    })
  },
  // 删除自有商品
  deleteOwnGoods (params) {
    return fetch.post('/mars/commodity/deleteCommodity', params)
  },
  // 添加自有商品
  addOwnGoods (params) {
    return fetch.post('/mars/commodity/create', params)
  },
  // 获取编辑详情
  getEditDetails (params) {
    return fetch.get('/mars/commodity/detail', { params })
  },
  // 编辑自有商品
  editOwnGoods (params) {
    return fetch.post('/mars/commodity/edit', params)
  },
  // 获取百诺恩商品分类
  getBainuoen (params) {
    return fetch.post('', params)
  },
  // 获取去百诺恩商品
  getBainuoenGoods (params) {
    return fetch.get('/mars/commodity/bne/query', { params })
  },
  // 编辑百诺恩商品
  editBainuoenGoods (params) {
    return fetch.post('', params)
  },
  // 创建分类
  createCategory (params) {
    return fetch.post('/mars/commodity/category/create', params)
  },
  // 获取分类
  getCategory (params) {
    return fetch.get('/mars/commodity/category/categoryQuery', { params })
  },
  getfirCategory (params) {
    return fetch.get('/mars/commodity/category/query', { params })
  },
  getsecCategory (params) {
    return fetch.get('/mars/commodity/category/query', { params })
  },
  // 编辑分类
  editCategory (params) {
    return fetch.post('/mars/commodity/category/edit', params)
  },
  // 获取规格
  getGuige () {
    return fetch.get('/mars/commodity/querySpecName')
  },
}
