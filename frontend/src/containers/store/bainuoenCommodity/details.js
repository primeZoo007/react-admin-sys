import React, { Component } from 'react'
import { Row, Col, Table } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import Title from 'components/Title'
import ContentBox from 'components/ContentBox'
import style from './details.css'

class Details extends Component {
  static propTypes = {
    form: PropTypes.object,
    router: PropTypes.object,
    match: PropTypes.object,
    getGoodsStoreDetails: PropTypes.func,
    details: PropTypes.object,
    instockList: PropTypes.array,
    loading: PropTypes.bool,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.handleReturn = this.handleReturn.bind(this)
  }

  componentDidMount () {
    const id = this.props.match.params.id
    this.props.getGoodsStoreDetails({ instockId: id })
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
        width: 160,
      },
      {
        title: '商品条形码',
        dataIndex: 'barcode',
        key: 'barcode',
        align: 'center',
        width: 160,
      },
      {
        title: '进货数量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        width: 160,
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
          <Title title="入库单信息" />
          <Row gutter={24}>
            <Col span={12}>
              <div className={style['detail-info']}>
                入库时间：{this.props.details && this.props.details.instockTime}
              </div>
            </Col>
            <Col span={12}>
              <div className={style['detail-info']}>
                订单状态：
                {this.props.details && this.props.details.statusString}
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <div className={style['detail-info-s']}>
                操作人员：{this.props.details && this.props.details.operator}
              </div>
            </Col>
            <Col span={12}>
              <div className={style['detail-info-s']}>
                入库批次编号：
                {this.props.details && this.props.details.instockId}
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <div className={style['detail-info-t']}>
                外部订单号：
                {this.props.details && this.props.details.thirdPartyId}
              </div>
            </Col>
          </Row>
          <Title title="商品信息" />
          <Table
            loading={this.props.loading}
            className={style['table-top']}
            rowKey={(record, index) => index}
            dataSource={this.props.instockList}
            columns={columns}
            pagination={false}
          />
          <div className={style['return-container']}>
            <button onClick={this.handleReturn}>返回</button>
          </div>
        </ContentBox>
      </div>
    )
  }
}

const mapState = state => ({
  loading: state.store.tableLoading,
  details: state.store.details,
  instockList: (state.store.details && state.store.details.instockList) || [],
})
const mapDispatch = dispatch => ({
  getGoodsStoreDetails: dispatch.store.getGoodsStoreDetails,
})

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Details)
)
