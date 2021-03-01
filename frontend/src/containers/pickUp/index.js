import React, { Component } from 'react'
import { Form, Row, Col, Input, Table, DatePicker, Modal, message } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import style from './index.css'
import bridge from 'utils/bridge'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 9 },
  },
  wrapperCol: {
    sm: { span: 15 },
  },
}
const PAGE_SIZE = 6
class PickFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
    router: PropTypes.object,
    getList: PropTypes.func,
  }
  constructor (props) {
    super(props)
    this.state = {
      pageNo: 1,
    }
    this.itemRender = this.itemRender.bind(this)
    this.handleDetails = this.handleDetails.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.pageChange = this.pageChange.bind(this)
  }

  itemRender (current, type, originalElement) {
    if (type === 'prev') {
      return <a>上一页</a>
    }
    if (type === 'next') {
      return <a>下一页</a>
    }
    return originalElement
  }

  componentDidMount () {
    // this.props.pickScan({
    //   code:
    //     'eyJvcmRlckNvZGUiOiJNRERELTMzMTg5LTIwMTkwNjE3MTYwNjE4IiwiY29kZSI6ImM3ZmFhZGFiYjgzZDlmOTRlNGI0NTVjMGU5YTU5NDYwIn0=',
    // })
    this.handleBridge()
    this.startSearch()
  }

  componentWillUnmount () {
    console.log('离开提货管理页面')
    bridge.clearScancode()
  }

  componentWillReceiveProps (nextPoprs) {
    if (!this.props.pickInfo && nextPoprs.pickInfo) {
      this.setState({
        visible: true,
      })
    }
  }

  handleBridge () {
    bridge.scanCode(response => {
      console.log('扫码枪回调', response)
      this.props.pickScan({
        code: (response && response.url) || '',
      })
    })
  }

  handleSearch () {
    this.startSearch()
  }

  pageChange (pageNo) {
    this.setState({ pageNo }, () => {
      this.startSearch()
    })
  }

  startSearch () {
    const { pageNo } = this.state
    this.props.form.validateFields((e, values) => {
      values.pageNo = pageNo
      values.pageSize = PAGE_SIZE
      if (values.time) {
        values.startTime = Date.parse(values.time[0])
        values.endTime = Date.parse(values.time[1])
      }
      delete values.time
      this.props.getList(values)
    })
  }

  handleDetails (record) {
    this.props.router.push(`/beinoen/pick/details/${record.outstockId}`)
  }

  handleConfirm () {
    bridge.screenLink(
      JSON.stringify({
        url: `/customer/pick/${this.props.pickInfo &&
          this.props.pickInfo.outstockId}`,
      })
    )
    this.props.confirmPick(
      {
        outstockId: this.props.pickInfo && this.props.pickInfo.outstockId,
      },
      () => {
        message.success('提货成功', 4)
        this.startSearch()
      }
    )

    this.setState({
      visible: false,
    })
  }

  handleCancel () {
    this.setState({
      visible: false,
    })
  }

  expandedRowRender (record) {
    const columns = [
      { title: '商品名称', dataIndex: 'commodityName', key: 'commodityName' },
      {
        title: '商品数量',
        key: 'count',
        dataIndex: 'count',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      { title: '商品单价', dataIndex: 'price', key: 'price' },
      { title: '子订单总价', dataIndex: 'totalPrice', key: 'totalPrice' },
    ]
    const data =
      (record &&
        record.subOutstockList &&
        record.subOutstockList.length > 0 &&
        record.subOutstockList) ||
      []

    return (
      <Table
        rowKey={record => record.commodityName}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    )
  }

  render () {
    const { getFieldDecorator } = this.props.form

    const pickColumn = [
      {
        title: '商品名称',
        dataIndex: 'commodityName',
        key: 'commodityName',
        align: 'center',
        width: 90,
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        width: 90,
      },
      {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        width: 90,
      },
      {
        title: '总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        align: 'center',
        width: 90,
      },
    ]

    const columns = [
      {
        title: '提货单号',
        dataIndex: 'outstockId',
        key: 'outstockId',
        align: 'center',
        width: 90,
      },
      {
        title: '外部订单号',
        dataIndex: 'thirdPartyId',
        key: 'thirdPartyId',
        align: 'center',
        width: 140,
      },
      {
        title: '账号',
        dataIndex: 'thirdPartyUserId',
        key: 'thirdPartyUserId',
        align: 'center',
        width: 140,
      },
      {
        title: '姓名',
        dataIndex: 'thirdPartyRealName',
        key: 'thirdPartyRealName',
        align: 'center',
        width: 90,
      },
      {
        title: '商品总数',
        dataIndex: 'totalCount',
        key: 'totalCount',
        align: 'center',
        width: 120,
      },
      {
        title: '订单总价',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        align: 'center',
        width: 120,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 90,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        width: 120,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        width: 120,
        render: (text, record) => (
          <a
            className={style['fix']}
            onClick={() => this.handleDetails(record)}
          >
            查询详情
          </a>
        ),
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
          <div className={style['search-container']}>
            <Form>
              <Row gutter={24}>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="提货单号">
                    {getFieldDecorator('outstockId')(
                      <Input placeholder="输入提货单号" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="外部订单号">
                    {getFieldDecorator('thirdPartyId', {})(
                      <Input placeholder="输入外部订单号" />
                    )}
                  </FormItem>
                </Col>
                {/* <Col span={8}>
                  <FormItem {...formItemLayout} label="商品名称">
                    {getFieldDecorator('commodityName', {})(
                      <Input placeholder="输入商品名称" />
                    )}
                  </FormItem>
                </Col> */}
              </Row>
              <Row gutter={24}>
                <Col span={11} pull={1}>
                  <FormItem {...formItemLayout} label="提货时间">
                    {getFieldDecorator('time')(<RangePicker />)}
                  </FormItem>
                </Col>
                <Col span={6} push={8}>
                  <button
                    onClick={this.handleSearch}
                    className={style['select']}
                  >
                    筛选
                  </button>
                </Col>
              </Row>
            </Form>
          </div>
        </ContentBox>
        <div style={{ textAlign: 'center' }}>请使用扫码枪进行提货</div>
        <ContentBox>
          <Table
            loading={this.props.loading}
            rowKey={record => record.outstockId}
            dataSource={this.props.dataSource}
            columns={columns}
            expandedRowRender={record => this.expandedRowRender(record)}
            pagination={{
              total: this.props.total,
              pageSize: PAGE_SIZE,
              onChange: this.pageChange,
              itemRender: this.itemRender,
            }}
          />
        </ContentBox>
        <Modal
          title="提货单信息"
          width={800}
          maskClosable={false}
          visible={this.state.visible}
          footer={null}
        >
          <div className={style['info-container']}>
            <div>
              提货单号：{this.props.pickInfo && this.props.pickInfo.outstockId}
            </div>
            <div>
              创建时间：{this.props.pickInfo && this.props.pickInfo.createTime}
            </div>
            <div>
              外部订单号：
              {this.props.pickInfo && this.props.pickInfo.thirdPartyId}
            </div>
            <div>
              提货单状态：{this.props.pickInfo && this.props.pickInfo.status}
            </div>
            {/* <div>商品名称：{this.props.pickInfo && this.props.pickInfo}</div> */}
            <div>
              商品数量：{this.props.pickInfo && this.props.pickInfo.totalCount}
            </div>
            {/* <div>会员名称：{this.props.pickInfo && this.props.pickInfo}</div> */}
          </div>
          <Table
            rowKey={record => record.commodityName}
            pagination={false}
            columns={pickColumn}
            dataSource={
              this.props.pickInfo && this.props.pickInfo.commodityList
            }
          />
          <div className={style['btn-container']}>
            <div className={style['ok']} onClick={() => this.handleConfirm()}>
              确认提货
            </div>
            <div
              className={style['cancel']}
              onClick={() => this.handleCancel()}
            >
              取消
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapState = state => ({
  total: state.pick.pickList && state.pick.pickList.total,
  dataSource: (state.pick.pickList && state.pick.pickList.list) || [],
  loading: state.pick.tableLoading,
  pickInfo: state.pick.pickInfo,
})
const mapDispatch = dispatch => ({
  getList: dispatch.pick.getList,
  confirmPick: dispatch.pick.confirmPick,
  pickScan: dispatch.pick.pickScan,
})
const Pick = Form.create()(PickFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Pick)
)
