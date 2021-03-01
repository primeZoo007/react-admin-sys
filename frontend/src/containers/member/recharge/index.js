import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  Input,
  Table,
  DatePicker,
  Modal,
  message,
  Select,
} from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import style from './index.css'
const { Option } = Select
const { RangePicker } = DatePicker
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
      this.handleSearch = this.handleSearch.bind(this)
      this.pageChange = this.pageChange.bind(this)
    }

    componentDidMount () {
      this.startSearch()
    }

    orderConfirm (record) {
      this.setState({
        confirmVisible: true,
        record,
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
        if (values.time && values.time[1]) {
          values.tradeBeginTime = values.time[0].format('YYYY-MM-DD HH:mm:ss')
          values.tradeEndTime = values.time[1].format('YYYY-MM-DD HH:mm:ss')
        }
        delete values.time
        delete values.payAmount
        this.props.getWaterDetail(values)
      })
    }

    deleteWaterDetail (record) {
      confirm({
        title: '请确认是否删除当前交易流水?',
        onOk: async () => {
          let json = await this.props.deleteWaterDetail({ recordId: record.recordId, mid: record.mid })
          if (json.success) {
            message.success('删除成功', 4)
            this.startSearch()
          }
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
      this.props.router.push(
        `/beinoen/member/rechargeDetail/${record.recordId}`
      )
    }

    render () {
      const { getFieldDecorator } = this.props.form
      const columns = [
        {
          title: '姓名',
          dataIndex: 'name',
          align: 'center',
          key: 'name',
          width: 150,
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          align: 'center',
          key: 'mobile',
          width: 160,
        },
        {
          title: '交易金额',
          dataIndex: 'tradeAmountStr',
          key: 'tradeAmountStr',
          align: 'center',
          width: 100,
        },
        {
          title: '交易类型',
          dataIndex: 'tradeTyoeStr',
          key: 'tradeTyoeStr',
          align: 'center',
          width: 100,
        },
        {
          title: '交易时间',
          dataIndex: 'tradeTime',
          key: 'tradeTime',
          align: 'center',
          width: 120,
        },
        {
          title: '余额',
          dataIndex: 'afterTradeBalanceStr',
          key: 'afterTradeBalanceStr',
          align: 'center',
          width: 120,
          render: text => text || '-',
        },
        {
          title: '操作员',
          dataIndex: 'clerkName',
          key: 'clerkName',
          align: 'center',
          width: 120,
        },
        {
          title: '操作',
          dataIndex: 'operate',
          key: 'operate',
          align: 'center',
          width: 200,
          render: (text, record) => {
            return (
                        <>
                          <div className={style['btn-container']}>
                            <a
                              onClick={() => this.toDetails(record)}
                              className={style['fix']}
                            >
                                        详情
                            </a>
                            {/* Vincent 2019-08-04 已支付状态也可以取消订单 */}
                            <a
                              onClick={() => this.deleteWaterDetail(record)}
                              className={style['fix']}
                            >
                                        删除
                            </a>
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
                <span className={style['title-left']}>交易流水</span>
              </div>
            </Title>
            <div className={style['search-container']}>
              <Form>
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="会员">
                      {getFieldDecorator('name')(
                        <Input placeholder="输入会员姓名" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={9}>
                    <FormItem {...formItemLayout} label="手机号">
                      {getFieldDecorator('mobile')(
                        <Input placeholder="输入手机号" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="交易类型">
                      {getFieldDecorator('tradeType')(
                        <Select placeholder="请选择交易类型" >
                          <Option value="1">充值</Option>
                          <Option value="2">提现</Option>
                          <Option value="3">消费</Option>
                          <Option value="4">手动变更</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={9}>
                    <FormItem {...formItemLayout} label="流水单号">
                      {getFieldDecorator('serialNo')(
                        <Input placeholder="输入流水单号" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24} >
                  <Col span={11} pull={1} >
                    <FormItem className={'fix-date'} {...formItemLayout} label="日期">
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
              </Form>
            </div>
          </ContentBox>
          <ContentBox>
            <Table
              loading={this.props.tableLoading}
              rowKey={(record, index) => index}
              dataSource={this.props.waterDetails}
              columns={columns}
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
  waterDetails: state.member.waterDetails || [],
  dataSource: (state.order.orders && state.order.orders.list) || [],
  total: (state.order.orders && state.order.orders.total) || 0,
  loading: state.order.tableLoading,
  updateRequest: state.order.updateRequest,
  telList: state.order.telList,
})
const mapDispatch = dispatch => ({
  getWaterDetail: dispatch.member.getWaterDetail,
  deleteWaterDetail: dispatch.member.deleteWaterDetail,
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
