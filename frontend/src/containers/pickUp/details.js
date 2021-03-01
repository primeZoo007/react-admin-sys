import React, { Component } from 'react'
import { Row, Col, Table, Spin } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import Title from 'components/Title'
import ContentBox from 'components/ContentBox'
import style from './details.css'

class Details extends Component {
  static propTypes = {
    form: PropTypes.func,
    router: PropTypes.object,
    getDetails: PropTypes.func,
    match: PropTypes.object,
    dataSource: PropTypes.array,
    pickDetails: PropTypes.object,
    loading: PropTypes.bool,
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
      // {
      //   title: 'SKU',
      //   dataIndex: 'b',
      //   key: 'b',
      //   align: 'center',
      // },
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
        title: '子订单总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        align: 'center',
      },
      {
        title: '子订单状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
      },
    ]
    return (
      <div className="contaienr-box">
        <Spin spinning={this.props.loading}>
          <ContentBox>
            <Title title="提货单信息" />
            <Row gutter={24}>
              <Col span={12}>
                <div className={style['detail-info']}>
                  下单时间：
                  {this.props.pickDetails &&
                    this.props.pickDetails.orderCreateTime}
                </div>
              </Col>
              <Col span={12}>
                <div className={style['detail-info']}>
                  提货时间：
                  {this.props.pickDetails &&
                    this.props.pickDetails.outstockTime}
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <div className={style['detail-info']}>
                  操作人员：
                  {this.props.pickDetails && this.props.pickDetails.operator}
                </div>
              </Col>
              <Col span={12}>
                <div className={style['detail-info']}>
                  订单状态：
                  {this.props.pickDetails && this.props.pickDetails.status}
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              {/* <Col span={12}>
              <div className={style['detail-info']}>
                父订单编号：{this.props.pickDetails && this.props.pickDetails}
              </div>
            </Col> */}
              <Col span={12}>
                <div className={style['detail-info']}>
                  外部订单编号：
                  {this.props.pickDetails &&
                    this.props.pickDetails.thirdPartyId}
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <div className={style['detail-info-s']}>
                  订单总价：
                  {this.props.pickDetails && this.props.pickDetails.totalAmount}
                </div>
              </Col>
            </Row>
            <Title title="用户信息" />
            <Row gutter={24}>
              <Col span={12}>
                <div className={style['detail-info-s']}>
                  用户类型：
                  {this.props.pickDetails && this.props.pickDetails.userType}
                </div>
              </Col>
              <Col span={12}>
                <div className={style['detail-info-s']}>
                  用户名称：
                  {(this.props.pickDetails &&
                    this.props.pickDetails.userName) ||
                    '-'}
                </div>
              </Col>
            </Row>
            <Title title="商品信息" />
            <Table
              className={style['table-top']}
              rowKey={(record, index) => index}
              dataSource={this.props.dataSource}
              columns={columns}
              pagination={false}
            />
            <div className={style['return-container']}>
              <button onClick={this.handleReturn}>返回</button>
            </div>
          </ContentBox>
        </Spin>
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
  )(Details)
)
