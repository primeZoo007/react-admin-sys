import React, { PureComponent } from 'react'
import { Modal, Tree } from 'antd'
// import { connect } from 'react-redux'
// import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import style from './power.css'

const { TreeNode } = Tree

class Power extends PureComponent {
  static propTypes = {
    form: PropTypes.object,
    title: PropTypes.string,
    type: PropTypes.string,
    handleCancel: PropTypes.func,
    powerVisible: PropTypes.bool,
  }
  constructor (props) {
    super(props)
    this.state = {
      tree: [
        {
          title: '商品',
          key: 'shop',
          children: [
            {
              title: '自有商品库',
              key: 'shopStore',
              children: [
                {
                  title: '筛选',
                  key: 'queryStore',
                },
                {
                  title: '新增自由商品',
                  key: 'addStore',
                },
                {
                  title: '编辑',
                  key: 'editStore',
                },
                {
                  title: '删除',
                  key: 'deleteStore',
                },
              ],
            },
            {
              title: '自有商品分类',
              key: 'shopClass',
              children: [
                {
                  title: '查询分类',
                  key: 'queryClass',
                },
                {
                  title: '新增分类',
                  key: 'addClass',
                },
                {
                  title: '编辑',
                  key: 'editClass',
                },
              ],
            },
            {
              title: '百诺恩商品库',
              key: 'bainuoenClass',
              children: [
                {
                  title: '筛选',
                  key: 'queryBNEStore',
                },
                {
                  title: '编辑',
                  key: 'editBNEStore',
                },
              ],
            },
          ],
        },
        {
          title: '订单',
          key: 'order',
          children: [
            {
              title: '订单列表',
              key: 'orderList',
              children: [
                {
                  title: '筛选',
                  key: 'queryOrder',
                },
                {
                  title: '详情',
                  key: 'detailOrder',
                },
                {
                  title: '确认(支付)',
                  key: 'payOrder',
                },
                {
                  title: '取消',
                  key: 'cancelOrder',
                },
              ],
            },
            {
              title: '创建订单',
              key: 'orderCreate',
              children: [
                {
                  title: '获取商品',
                  key: 'queryOrderStore',
                },
                {
                  title: '按照商品名称搜索',
                  key: 'queryOrderStoreByName',
                },
                {
                  title: '生成订单',
                  key: 'createOrder',
                },
              ],
            },
          ],
        },
        {
          title: '库存',
          key: 'store',
          children: [
            {
              title: '自有商品入库',
              key: 'goodsStore',
              children: [
                {
                  title: '筛选',
                  key: 'queryStock',
                },
                {
                  title: '自有商品入库',
                  key: 'inStock',
                },
                {
                  title: '查询详情',
                  key: 'detailStock',
                },
                {
                  title: '编辑',
                  key: 'editStock',
                },
              ],
            },
            {
              title: '百诺恩商品入库',
              key: 'bainuoenStore',
              children: [
                {
                  title: '筛选',
                  key: 'queryBNEStock',
                },
                {
                  title: '查看详情',
                  key: 'detailBNEStock',
                },
              ],
            },
            {
              title: '库存流水',
              key: 'stockWater',
              children: [
                {
                  title: '筛选',
                  key: 'queryStockWater',
                },
                {
                  title: '详情',
                  key: 'detailStockWater',
                },
              ],
            },
          ],
        },
        {
          title: '提货',
          key: 'pick',
          children: [
            {
              title: '提货单管理',
              key: 'pickOrder',
              children: [
                {
                  title: '筛选',
                  key: 'queryPick',
                },
                {
                  title: '查询详情',
                  key: 'detailPick',
                },
              ],
            },
          ],
        },
        {
          title: '服务',
          key: 'service',
          children: [
            {
              title: '服务列表',
              key: 'serviceList',
              children: [
                {
                  title: '筛选',
                  key: 'queryService',
                },
                {
                  title: '新增服务',
                  key: 'addService',
                },
                {
                  title: '查看详情',
                  key: 'detailService',
                },
                {
                  title: '关闭',
                  key: 'closeService',
                },
              ],
            },
            {
              title: '消费',
              key: 'serviceConsume',
              children: [
                {
                  title: '筛选',
                  key: 'queryConsume',
                },
                {
                  title: '消费',
                  key: 'consumeService',
                },
                {
                  title: '查询详情',
                  key: 'detailConsume',
                },
              ],
            },
          ],
        },
        {
          title: '会员',
          key: 'member',
          children: [
            {
              title: '会员管理',
              key: 'memberManager',
              children: [
                {
                  title: '筛选',
                  key: 'queryMember',
                },
                {
                  title: '新增百诺恩会员',
                  key: 'addBNEMember',
                },
                {
                  title: '新增会员',
                  key: 'addMember',
                },
                {
                  title: '充值',
                  key: 'recharge',
                },
                {
                  title: '编辑',
                  key: 'editMember',
                },
                {
                  title: '失效',
                  key: 'invalidMember',
                },
              ],
            },
            {
              title: '交易流水',
              key: 'memberTradeWater',
              children: [
                {
                  title: '筛选',
                  key: 'queryTradeWater',
                },
                {
                  title: '详情',
                  key: 'detailTradeWater',
                },
                {
                  title: '删除',
                  key: 'deleteTradeWater',
                },
              ],
            },
          ],
        },
        {
          title: '统计',
          key: 'statistics',
          children: [
            {
              title: '销售统计',
              key: 'salesStatistics',
              children: [
                {
                  title: '筛选',
                  key: 'queryStatis',
                },
              ],
            },
          ],
        },
        {
          title: '系统',
          key: 'system',
          children: [
            {
              title: '店员管理',
              key: 'systemClerk',
              children: [
                {
                  title: '筛选',
                  key: 'queryClerk',
                },
                {
                  title: '新增店员',
                  key: 'addClerk',
                },
                {
                  title: '权限管理',
                  key: 'powerManager',
                },
                {
                  title: '重置密码',
                  key: 'resetPasswd',
                },
                {
                  title: '编辑',
                  key: 'editClerk',
                },
                {
                  title: '删除',
                  key: 'deleteClerk',
                },
              ],
            },
            {
              title: '支付码设置',
              key: 'systemPay',
              children: [
                {
                  title: '保存',
                  key: 'savePayCode',
                },
                {
                  title: '扫码添加',
                  key: 'sweepCode',
                },
              ],
            },
            {
              title: '修改密码',
              key: 'systemPassword',
              children: [
                {
                  title: '保存',
                  key: 'updatePasswd',
                },
              ],
            },
          ],
        },
      ],
    }
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.onCheck = this.onCheck.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  handleCancel () {
    this.props.handleCancel()
  }

  handleOk () {
    this.props.handleOk()
  }

  onCheck (keys, info) {
    this.props.powerCheck(keys, info)
  }

  handleConfirm () {
    this.props.powerConfirm()
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} />
    })

  render () {
    return (
      <>
        <Modal
          title={this.props.title}
          maskClosable={false}
          destroyOnClose
          footer={null}
          onCheck={this.onCheck}
          visible={this.props.powerVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Tree
            checkable
            onCheck={this.onCheck}
            defaultCheckedKeys={this.props.selectedKeys}
            // selectedKeys={this.state.selectedKeys}
          >
            {this.renderTreeNodes(this.state.tree)}
          </Tree>
          <div className={style['btn-container']}>
            <button onClick={this.handleCancel} className={style['cancel-btn']}>
              取消
            </button>
            <button
              onClick={this.handleConfirm}
              className={style['confirm-btn']}
            >
              确认
            </button>
          </div>
        </Modal>
      </>
    )
  }
}

export default Power
