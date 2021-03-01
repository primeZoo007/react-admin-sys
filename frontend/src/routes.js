export const routes = [
  {
    path: '/login',
    page: './login',
  },
  {
    path: '/beinoen/ad',
    page: './ad',
  },
  {
    path: '/beinoen/shop/store',
    page: './shop/store',
  },
  {
    path: '/beinoen/shop/classification',
    page: './shop/classification',
  },
  {
    path: '/beinoen/shop/beinoenStore',
    page: './shop/beinoenStore',
  },
  {
    path: '/beinoen/shop/add',
    page: './shop/store/add',
  },
  {
    path: '/beinoen/shop/edit/:id',
    page: './shop/store/edit',
  },
  {
    path: '/beinoen/shop/fix',
    page: './shop/beinoenStore/fix',
  },
  {
    path: '/beinoen/order/add',
    page: './order/add',
  },
  {
    path: '/beinoen/order',
    page: './order',
  },
  {
    path: '/beinoen/orders/details/:id',
    page: './order/details',
  },
  {
    path: '/beinoen/commodity/store',
    page: './store/commodityStore',
  },
  {
    path: '/beinoen/commodity/details/:id',
    page: './store/commodityStore/details',
  },
  {
    path: '/beinoen/commodity/sort',
    page: './store/commoditySort',
  },
  {
    path: '/beinoen/bainuoenCommodity/details/:id',
    page: './store/bainuoenCommodity/details',
  },
  {
    path: '/beinoen/commodity',
    page: './store/bainuoenCommodity',
  },
  {
    path: '/beinoen/pick/up',
    page: './pickUp',
  },
  {
    path: '/beinoen/pick/details/:id',
    page: './pickUp/details',
  },
  {
    path: '/beinoen/service/list',
    page: './service/list',
  },
  {
    path: '/beinoen/service/new',
    page: './service/new',
  },
  {
    path: '/beinoen/service/details/:id',
    page: './service/details',
  },
  {
    path: '/beinoen/service/consumer',
    page: './service/consumer',
  },
  {
    path: '/beinoen/member/list',
    page: './member',
  }, {
    path: '/beinoen/report/saleStatic',
    page: './report/saleStatic',
  },
  {
    path: '/beinoen/system/clerk',
    page: './system/clerk',
  },
  {
    path: '/beinoen/system/pay',
    page: './system/pay',
  },
  {
    path: '/beinoen/system/password',
    page: './system/password',
  },
  {
    path: '/beinoen/quick/order',
    page: './quick/order',
  },
  {
    path: '/beinoen/quick/customer/order',
    page: './quick/customerOrder',
  },
  {
    path: '/customer/consumption/:id',
    page: './customer/consumption',
  },
  {
    path: '/customer/order/:id',
    page: './customer/order',
  },
  {
    path: '/beinoen/member/recharge',
    page: './member/recharge',
  },
  {
    path: '/beinoen/member/rechargeDetail/:id',
    page: './member/recharge/details',
  },
  {
    path: '/customer/pay',
    page: './customer/pay',
  },
  {
    path: '/customer/ad',
    page: './customer/ad',
  },
  {
    path: '/customer/pick/:id',
    page: './customer/pick',
  },
  {
    path: '/beinoen/stockWater',
    page: './store/commodityWater',
  },
  {
    path: '/beinoen/stockDetails/:id',
    page: './store/commodityWater/details',
  },
]

export const menu = {
  admin: [
    {
      icon: 'shopping',
      name: '商品',
      key: 'shop',
      child: [
        {
          name: '自有商品库',
          route: '/beinoen/shop/store',
          key: 'shopStore',
        },
        {
          name: '自有商品分类',
          route: '/beinoen/shop/classification',
          key: 'shopClass',
        },
        {
          name: '百诺恩商品库',
          key: 'bainuoenClass',
          route: '/beinoen/shop/beinoenStore',
        },
      ],
    },
    {
      icon: 'switcher',
      name: '订单',
      route: '/beinoen/order',
      key: 'order',
      child: [
        {
          name: '订单列表',
          route: '/beinoen/order',
          key: 'orderList',
        },
        {
          name: '创建订单',
          route: '/beinoen/order/add',
          key: 'orderCreate',
        },
      ],
    },
    {
      icon: 'shop',
      name: '库存',
      key: 'store',
      child: [
        {
          key: 'goodsStore',
          name: '自有商品入库',
          route: '/beinoen/commodity/store',
        },
        {
          key: 'bainuoenStore',
          name: '百诺恩商品入库',
          route: '/beinoen/commodity',
        },
        {
          key: 'storeWater',
          name: ' 库存流水',
          route: '/beinoen/stockWater',
        },
      ],
    },
    {
      icon: 'shop',
      name: '报表',
      key: 'report',
      child: [
        {
          key: 'saleStatic',
          name: '销售统计',
          route: '/beinoen/report/saleStatic',
        },
      ],
    },
    {
      icon: 'car',
      name: '提货',
      key: 'pick',
      child: [
        {
          key: 'pickOrder',
          name: '提货单管理',
          route: '/beinoen/pick/up',
        },
        {
          key: 'pickDetails',
          name: '提货单详情',
          route: '/beinoen/pick/details',
        },
      ],
    },
    {
      icon: 'gift',
      name: '服务',
      key: 'service',
      child: [
        {
          key: 'serviceList',
          name: '服务列表',
          route: '/beinoen/service/list',
        },
        // {
        //   name: '新增服务',
        //   route: '/beinoen/service/new',
        // },
        // {
        //   name: '服务详情',
        //   route: '/beinoen/service/details',
        // },
        {
          key: 'serviceConsume',
          name: '消费页面',
          route: '/beinoen/service/consumer',
        },
      ],
    },
    {
      key: 'member',
      icon: 'crown',
      name: '会员',
      route: '/beinoen/member/list',
      // child: [
      //   {
      //     name: '会员列表',
      //     route: '/beinoen/member/list',
      //   },
      // ],
    },
    {
      key: 'system',
      icon: 'setting',
      name: '系统',
      child: [
        {
          key: 'systemClerk',
          name: '店员管理',
          route: '/beinoen/system/clerk',
        },
        {
          key: 'systemPay',
          name: '支付码设置',
          route: '/beinoen/system/pay',
        },
        {
          key: 'systemPassword',
          name: '修改密码',
          route: '/beinoen/system/password',
        },
      ],
    },
  ],
}
