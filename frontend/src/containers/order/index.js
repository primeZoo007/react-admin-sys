import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  Select,
  Input,
  Table,
  DatePicker,
  Modal,
  message,
} from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import bridge from 'utils/bridge'
import style from './index.css'

const { RangePicker } = DatePicker
const { Option } = Select
const confirm = Modal.confirm
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

class OrderFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {
      pageNo: 1,
      record: {},
      telList: [],
      comfirmDisabled: true,
    }
    this.itemRender = this.itemRender.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.searchTel = this.searchTel.bind(this)
    this.printPaper = this.printPaper.bind(this)
  }

  componentDidMount () {
    this.startSearch()
  }
  printPaper () {
    bridge.printPaper()
  }
  componentWillReceiveProps (nextProps) {
    if (!this.props.updateRequest && nextProps.updateRequest) {
      message.success('更新成功', 4)
      this.startSearch()
    }
  }

  async searchTel (val) {
    let params = {
      mobile: val,
    }
    if (val.length > 3) {
      let json = await this.props.getTelList(params)
      if (json.success) {
        this.setState({
          telList: json.data.list,
        })
      } else {
        this.setState({
          telList: [],
        })
      }
    }
  }
  orderConfirm (record) {
    console.log(record)
    let params = {
      mid: record.memberId,
    }
    this.props.getBalance(params)
    this.setState({
      confirmVisible: true,
      record,
    })
  }

  handlePay () {
    // if(state.money>=this.state.) {
    const { record } = this.state
    bridge.screenLink(
      JSON.stringify({
        url: `/customer/pay`,
      })
    )
    // eslint-disable-next-line eqeqeq
    this.props.form.validateFields((e, values) => {
      // eslint-disable-next-line eqeqeq
      if (this.props.form.getFieldValue('paymentType') === '4') {
        let walletBalance = parseInt((parseFloat(this.props.form.getFieldValue('payBalance')).toFixed(2) * 100).toFixed(0))
        let payAmount = parseInt((parseFloat(this.props.form.getFieldValue('payAmount')).toFixed(2) * 100).toFixed(0))
        if (walletBalance >= payAmount) {
          // 余额充足时的情况
          confirm({
            title: '请确认是否收到付款?',
            onOk: () => {
              this.props.updateOrder({
                orderId: record.orderId,
                payAmount: this.props.form.getFieldValue('payAmount'),
                paymentType: this.props.form.getFieldValue('paymentType'),
              })
              this.setState({
                confirmVisible: false,
              })
            },
            onCancel () {
            },
          })
        } else {
          message.error('余额不足', 4)
        }
      } else {
        confirm({
          title: '请确认是否收到付款?',
          onOk: () => {
            this.props.updateOrder({
              orderId: record.orderId,
              payAmount: this.props.form.getFieldValue('payAmount'),
              paymentType: this.props.form.getFieldValue('paymentType'),
            })
            this.setState({
              confirmVisible: false,
            })
          },
          onCancel () {
          },
        })
      }
      // }
    })
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

  handleAdd () {
    this.props.router.push('/beinoen/order/add')
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
      console.log(values)
      values.pageNo = pageNo
      values.pageSize = PAGE_SIZE
      if (values.time) {
        values.createTimeStart = Date.parse(values.time[0])
        values.createTimeEnd = Date.parse(values.time[1])
      }
      delete values.time
      delete values.payAmount
      this.props.getOrder(values)
    })
  }

  orderCancel (record) {
    confirm({
      title: '请确认是否取消订单?',
      onOk: () => {
        this.props.orderCancel({ orderId: record.orderId }, () => {
          message.success('取消成功', 4)
          this.startSearch()
        })
      },
      onCancel () {},
    })
  }

  expandedRowRender (record) {
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'commodityName',
        key: 'commodityName',
        align: 'center',
      },
      { title: 'SKU', dataIndex: 'sku', key: 'sku', align: 'center' },
      {
        title: '商品条形码',
        key: 'barcode',
        dataIndex: 'barcode',
        align: 'center',
      },
      {
        title: '商品数量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
      },
      {
        title: '折扣',
        dataIndex: 'subOrderDiscount',
        key: 'subOrderDiscount',
        align: 'center',
        render: text => text + '折',
      },
      {
        title: '商品单价',
        dataIndex: 'memberPrice',
        key: 'memberPrice',
        align: 'center',
      },
      {
        title: '商品总价',
        dataIndex: 'subOrderReceivableAmountStr',
        key: 'subOrderReceivableAmountStr',
        align: 'center',
      },
      {
        title: '优惠',
        dataIndex: 'preferentialTypeName',
        key: 'preferentialTypeName',
        align: 'center',
      },
    ]
    const data =
      (record &&
        record.subOrderList &&
        record.subOrderList.length > 0 &&
        record.subOrderList) ||
      []

    return (
      <Table
        rowKey={record => record.barcode}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    )
  }

  toDetails (record) {
    bridge.screenLink(
      JSON.stringify({
        url: `/customer/order/${record.orderId}`,
      })
    )
    this.props.router.push(`/beinoen/orders/details/${record.orderId}`)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderSerialNumber',
        align: 'center',
        key: 'orderSerialNumber',
        width: 100,
      },
      {
        title: '订单类型',
        dataIndex: 'typeString',
        align: 'center',
        key: 'typeString',
        width: 100,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center',
        width: 100,
      },
      {
        title: '导购员',
        dataIndex: 'guider',
        key: 'guider',
        align: 'center',
        width: 80,
      },
      {
        title: '订单总额',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        align: 'center',
        width: 100,
      },
      {
        title: '实付金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
        align: 'center',
        width: 100,
        render: text => text || '-',
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 100,
        render: text => {
          if (text === 0) {
            return '已创建，待支付'
          }
          if (text === 1) {
            return '已支付'
          }
          if (text === 2) {
            return '已取消'
          }
        },
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
        render: (text, record) => {
          return (
            <>
              <div className={style['btn-fix']}>
                <a
                  onClick={() => this.toDetails(record)}
                  className={style['fix']}
                >
                  详情
                </a>
                {record.status === 0 ? (
                  <a
                    onClick={() => this.orderConfirm(record)}
                    className={style['fix']}
                  >
                    确认
                  </a>
                ) : null}
              </div>
              <div className={style['btn-fix']}>
                {/* Vincent 2019-08-04 已支付状态也可以取消订单 */}
                {(record.status === 0 || record.status === 1) ? (
                  <a
                    onClick={() => this.orderCancel(record)}
                    className={style['fix']}
                  >
                    取消
                  </a>
                ) : null}
              </div>
            </>
          )
        },
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
          <Title>
            <div>
              <div style={{ height: 30 }} />
              <span className={style['title-left']}>主菜单</span>
            </div>
          </Title>
          <div className={style['search-container']}>
            <Form>
              <Row gutter={24}>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="订单号">
                    {getFieldDecorator('orderId')(
                      <Input placeholder="输入订单号" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="订单类型">
                    {getFieldDecorator('type', {})(
                      <Select placeholder="选择订单类型">
                        <Option value="0">普通订单</Option>
                        <Option value="1">服务订单</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="手机号">
                    {getFieldDecorator('mobile')(
                      <Input placeholder="输入手机号" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={11} pull={1}>
                  <FormItem {...formItemLayout} label="下单时间">
                    {getFieldDecorator('time')(<RangePicker />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={6} push={20}>
                  <button
                    onClick={this.handleSearch}
                    className={style['select']}
                  >
                    筛选
                  </button>
                </Col>
              </Row>
              <Modal
                destroyOnClose
                maskClosable={false}
                title="确认订单"
                visible={this.state.confirmVisible}
                onCancel={() => {
                  this.setState({
                    confirmVisible: false,
                  })
                }}
                onOk={() => this.handlePay()}
              >
                <FormItem
                  {...{
                    labelCol: {
                      sm: { span: 6 },
                    },
                    wrapperCol: {
                      sm: { span: 15 },
                    },
                  }}
                  label="订单金额"
                >
                  {getFieldDecorator('payAmount', {
                    initialValue:
                      this.state.record && this.state.record.totalAmount,
                  })(<Input
                    disabled={this.state.comfirmDisabled} />)}
                </FormItem>
                <FormItem {...{
                  labelCol: {
                    sm: { span: 6 },
                  },
                  wrapperCol: {
                    sm: { span: 10 },
                  },
                }} label="支付方式">
                  {getFieldDecorator('paymentType', {})(
                    <Select placeholder="请选择支付方式" className={style['pay-type']}>
                      <Option value="0" >其他</Option>
                      <Option value="1">支付宝</Option>
                      <Option value="2">微信</Option>
                      <Option value="3">现金</Option>
                      <Option value="4" style={{ display: this.props.isMember }}>钱包</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  {...{
                    labelCol: {
                      sm: { span: 6 },
                    },
                    wrapperCol: {
                      sm: { span: 15 },
                    },
                  }}
                  label="钱包余额"
                  style={{ display: this.props.isMember }}
                >
                  {getFieldDecorator('payBalance', {
                    initialValue:
                       this.props.balace,
                  })(<Input
                    disabled={this.state.comfirmDisabled} />)}
                </FormItem>
              </Modal>
            </Form>
          </div>
        </ContentBox>
        <ContentBox>
          <Table
            loading={this.props.loading}
            rowKey={(record, index) => index}
            dataSource={this.props.dataSource}
            columns={columns}
            expandedRowRender={record =>
              record.type === 1 ? null : this.expandedRowRender(record)
            }
            pagination={{
              pageSize: PAGE_SIZE,
              total: this.props.total,
              onChange: this.pageChange,
              itemRender: this.itemRender,
            }}
          />
        </ContentBox>
      </div>
    )
  }
}

const mapState = state => ({
  balace: state.order.balace,
  isMember: state.order.isMember,
  dataSource: (state.order.orders && state.order.orders.list) || [],
  total: (state.order.orders && state.order.orders.total) || 0,
  loading: state.order.tableLoading,
  updateRequest: state.order.updateRequest,
  telList: state.order.telList,
})
const mapDispatch = dispatch => ({
  getBalance: dispatch.order.getBalance,
  getOrder: dispatch.order.getOrder,
  updateOrder: dispatch.order.updateOrder,
  orderCancel: dispatch.order.orderCancel,
  getTelList: dispatch.order.getTelList,
})
const Order = Form.create()(OrderFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Order)
)
