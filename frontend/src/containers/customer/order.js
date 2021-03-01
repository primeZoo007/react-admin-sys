import React, { Component } from 'react'
import { Table, Row, Col } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import style from './order.css'

class Order extends Component {
  static propTypes = {
    form: PropTypes.object,
    router: PropTypes.object,
    match: PropTypes.object,
    orderItem: PropTypes.object,
    getOrderItem: PropTypes.func,
    dataSource: PropTypes.array,
    loading: PropTypes.bool,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.handleReturn = this.handleReturn.bind(this)
  }

  componentDidMount () {
    this.props.getOrderItem({
      orderId: this.props.match.params.id,
    })
  }

  handleReturn () {
    this.props.router.goBack()
  }

  render () {
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'commodityName',
        key: 'commodityName',
        align: 'center',
        width: 120,
      },
      {
        title: '商品条形码',
        key: 'barcode',
        dataIndex: 'barcode',
        align: 'center',
        width: 160,
      },
      {
        title: '商品数量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        width: 90,
      },
      {
        title: '商品单价',
        dataIndex: 'commodityPrice',
        key: 'commodityPrice',
        align: 'center',
        width: 90,
      },
      {
        title: '商品总价',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        align: 'center',
        width: 90,
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
          <div className={style['header-container']}>
            <Row gutter={24}>
              <Col span={8}>
                <div className={style['type']}>
                  订单类型：{this.props.orderItem.typeString}
                </div>
              </Col>
              <Col span={8}>
                <div className={style['money']}>
                  实付金额：￥{this.props.orderItem.payAmount}
                </div>
              </Col>
              <Col span={8}>
                <div className={style['money']}>
                  订单总额：￥{this.props.orderItem.totalAmount}
                </div>
              </Col>
            </Row>
          </div>
          <div className={style['header-container']}>
            <Row gutter={24}>
              <Col span={8}>
                <div className={style['type']}>
                  订单号：{this.props.orderItem.orderId}
                </div>
              </Col>
              <Col span={8}>
                <div className={style['money']}>
                  时间：{this.props.orderItem.createTime}
                </div>
              </Col>
              <Col span={8}>
                <div className={style['money']}>
                  操作员：{this.props.orderItem.operator}
                </div>
              </Col>
            </Row>
          </div>
          <Table
            loading={this.props.loading}
            className={style['table-top']}
            rowKey={(record, index) => index}
            dataSource={this.props.dataSource}
            columns={columns}
            pagination={false}
          />
        </ContentBox>
      </div>
    )
  }
}

const mapState = state => ({
  loading: state.order.tableLoading || false,
  orderItem: state.order.orderItem || {},
  dataSource:
    (state.order.orderItem && state.order.orderItem.subOrderList) || [],
})
const mapDispatch = dispatch => ({
  getOrderItem: dispatch.order.getOrderItem,
})

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Order)
)
