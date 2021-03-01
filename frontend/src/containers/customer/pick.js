import React, { Component } from 'react'
import { Table, Row, Col } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import style from './pick.css'
import Title from 'components/Title'

class Order extends Component {
  static propTypes = {
    form: PropTypes.object,
    router: PropTypes.object,
    match: PropTypes.object,
    dataSource: PropTypes.array,
    loading: PropTypes.bool,
    getDetails: PropTypes.func,
    pickDetails: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.handleReturn = this.handleReturn.bind(this)
  }

  componentDidMount () {
    const { id } = this.props.match.params
    this.props.getDetails({ outstockId: id })
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
      },
      {
        title: '商品数量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
      },
      {
        title: '商品单价',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      },
      {
        title: '订单总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        align: 'center',
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
          <Title title="提货单信息" />
          <Row gutter={24}>
            <Col span={12}>
              <div className={style['detail-info']}>
                操作人员：
                {this.props.pickDetails && this.props.pickDetails.operator}
              </div>
            </Col>
            <Col span={12}>
              <div className={style['detail-info']}>
                提货时间：
                {this.props.pickDetails && this.props.pickDetails.outstockTime}
              </div>
            </Col>
          </Row>
          <Title title="商品信息" />
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
  loading: state.pick.tableLoading,
  pickDetails: state.pick.pickDetails,
  dataSource:
    (state.pick.pickDetails && state.pick.pickDetails.subOutstockList) || [],
})
const mapDispatch = dispatch => ({
  getDetails: dispatch.pick.getDetails,
})

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Order)
)
