import React, { Component } from 'react'
import { Form, Row, Col, Spin, Table } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import style from './details.css'
import bridge from 'utils/bridge'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 15 },
  },
}

class DetailsFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
    editService: PropTypes.func,
  }
  constructor (props) {
    super(props)
    this.state = {
      print: false,
      display: 'none',
    }
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.printPaper = this.printPaper.bind(this)
  }

  async componentDidMount () {
    let json = await this.props.orderDetail({
      orderId: this.props.match.params.id,
    })
    if (json.data.status === 1) {
      this.setState({
        display: 'block',
      })
    } else {
      this.setState({
        display: 'none',
      })
    }
  }

  async printPaper () {
    this.setState({
      print: true,
      color: '#1111',
    })
    setTimeout(() => {
      this.setState({
        print: false,
        color: 'rgba(104, 129, 235, 1)',
      })
    }, 5000)
    let json = await this.props.orderDetail({
      orderId: this.props.match.params.id,
    })
    // eslint-disable-next-line no-unused-vars
    let total = 0
    // eslint-disable-next-line no-unused-vars
    let count = 0
    let list = []
    if (json.data.subOrderList) {
      json.data.subOrderList.map((item, key) => {
        count += item.count
        list[key] = {
          goodsName: item.commodityName,
          goodsPrice: item.commodityPrice,
          goodsCount: item.count,
          unit: '',
          goodsCost: item.totalAmount,
        }
      })
    }
    console.log(json.data)
    let discount
    // eslint-disable-next-line eqeqeq
    if (json.data.combinationPreferentialModels && json.data.combinationPreferentialModels.length != 0) {
      let m = 0
      json.data.combinationPreferentialModels.map((item) => {
        m = m + item.amount / 100
      })
      discount = -parseFloat(json.data.totalAmount) + parseFloat(json.data.payAmount) - parseFloat(m)
    } else if (json.data.subOrderList && json.data.subOrderList.length > 0) {
      discount = -parseFloat(json.data.totalAmount) + parseFloat(json.data.payAmount)
    } else {
      list = []
      discount = -parseFloat(json.data.totalAmount) + parseFloat(json.data.payAmount)
    }
    console.log(json.data)
    let walletBalance = (parseInt(json.data.balance) / 100.0).toFixed(2)
    // let walletBalance = (parseInt('1000000')/100.0).toFixed(2);
    let params = {
      isMember: json.data.isMember,
      payTypeStr: json.data.payTypeStr,
      balance: walletBalance,
      createTime: json.data.createTime,
      orderNum: json.data.orderSerialNumber,
      clerk: {
        clerkName: json.data.memberName || '',
        clerkPhone: json.data.mobile || '-',
      },
      list: list || [],
      all: {
        count: count,
        cost: json.data.totalAmount,
      },
      discount: discount + '' || '-',
      pay: json.data.payAmount || '-',
      operator: json.data.operator,
      shopName: window.localStorage.getItem('shopName'),
    }
    console.log(params)
    bridge.printOrder(JSON.stringify(params)
    )
  }
  handleOk () {
    this.props.form.validateFields((e, values) => {
      values.id = this.props.eDetails.id
      this.props.editService(values)
    })
  }

  handleCancel () {
    this.props.router.goBack()
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'commodityName',
        key: 'commodityName',
        align: 'center',
        width: 120,
      },
      {
        title: 'SKU',
        dataIndex: 'commoditySku',
        key: 'commoditySku',
        align: 'center',
        width: 160,
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
      }, {
        title: '折扣',
        dataIndex: 'subOrderDiscountStr',
        key: 'subOrderDiscountStr',
        align: 'center',
        width: 90,
      },
      {
        title: '折后总价',
        dataIndex: 'subOrderReceivableAmountStr',
        key: 'subOrderReceivableAmountStr',
        align: 'center',
        width: 90,
      },
    ]
    return (
      <div className="contaienr-box">
        <Spin spinning={false}>
          <ContentBox>
            <Title title="订单状态" >
              <div>
                <div style={{ height: '30px' }} />
                <div className={style['title-left']}>订单状态</div>
                <button className={style['add-btn']} onClick={this.printPaper} style={{ display: this.state.display, background: this.state.color }} disabled={this.state.print}>
                  打印小票
                </button>
              </div>
            </Title>
            <div className={style['search-container']}>
              <Row gutter={24} style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <Form>
                    <FormItem {...formItemLayout} label="订单类型">
                      {getFieldDecorator('name')(
                        <div className={style['detail-info']}>
                          {this.props.details && this.props.details.typeString}
                        </div>
                      )}
                    </FormItem>
                  </Form>
                </Col>
              </Row>
              <Row gutter={24} style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <Form>
                    <FormItem {...formItemLayout} label="订单状态">
                      {getFieldDecorator('name')(
                        <div className={style['detail-info']}>
                          {this._renderStatus(
                            this.props.details && this.props.details.status
                          )}
                          {/* {this.props.details && this.props.details.status === 0
                            ? '已创建，待支付'
                            : '已支付'} */}
                        </div>
                      )}
                    </FormItem>
                  </Form>
                </Col>
              </Row>
              <Row gutter={24} style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <Form>
                    <FormItem {...formItemLayout} label="支付方式">
                      {getFieldDecorator('name')(
                        <div className={style['detail-info']}>
                          {this.props.details && this.props.details.payTypeStr}
                        </div>
                      )}
                    </FormItem>
                  </Form>
                </Col>
              </Row>
              <Row gutter={24} style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <Form>
                    <FormItem {...formItemLayout} label="订单编号">
                      {getFieldDecorator('name')(
                        <div className={style['detail-info']}>
                          {this.props.details && this.props.details.orderSerialNumber}
                        </div>
                      )}
                    </FormItem>
                  </Form>
                </Col>
              </Row>
              <Row gutter={24} style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <Form>
                    <FormItem {...formItemLayout} label="下单时间">
                      {getFieldDecorator('name')(
                        <div className={style['detail-info']}>
                          {this.props.details && this.props.details.createTime}
                        </div>
                      )}
                    </FormItem>
                  </Form>
                </Col>
              </Row>
              {this.props.details && this.props.details.type === 1 && (
                <Row gutter={24} style={{ marginTop: '10px' }}>
                  <Col span={12}>
                    <Form>
                      <FormItem {...formItemLayout} label="过期时间">
                        {getFieldDecorator('name')(
                          <div className={style['detail-info']}>
                            {this.props.details && this.props.details.validDate}
                          </div>
                        )}
                      </FormItem>
                    </Form>
                  </Col>
                </Row>
              )}
              <Title title="用户信息" />
              <Row gutter={24} style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <Form>
                    <FormItem {...formItemLayout} label="用户">
                      {getFieldDecorator('scope')(
                        <div className={style['detail-info']}>
                          {this.props.details && this.props.details.userType}
                        </div>
                      )}
                    </FormItem>
                  </Form>
                </Col>
              </Row>
              <Row gutter={24} style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <Form>
                    <FormItem {...formItemLayout} label="手机号">
                      {getFieldDecorator('mobile')(
                        <div className={style['detail-info']}>
                          {(this.props.details && this.props.details.mobile) ||
                            '-'}
                        </div>
                      )}
                    </FormItem>
                  </Form>
                </Col>
              </Row>
              <Title title="支付信息" />
              <Row gutter={24} style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <Form>
                    <FormItem {...formItemLayout} label="订单总额">
                      {getFieldDecorator('commodityId')(
                        <div className={style['detail-info']}>
                          {this.props.details && this.props.details.totalAmount}
                        </div>
                      )}
                    </FormItem>
                  </Form>
                </Col>
                <Col span={12}>
                  <Form>
                    <FormItem {...formItemLayout} label="实付金额">
                      {getFieldDecorator('payAmount')(
                        <div className={style['detail-info']}>
                          {this.props.details && this.props.details.payAmount}
                        </div>
                      )}
                    </FormItem>
                  </Form>
                </Col>
              </Row>
            </div>
            <Table
              rowKey={record => record.barcode}
              columns={columns}
              dataSource={this.props.dataSource}
              pagination={false}
            />
            <div className={style['btn-container']}>
              <button
                onClick={() => {
                  this.props.router.goBack()
                }}
                className={style['save']}
              >
                返回
              </button>
            </div>
          </ContentBox>
        </Spin>
      </div>
    )
  }
  _renderStatus (status) {
    if (status === 0) {
      return '已创建，待支付'
    }
    if (status === 1) {
      return '已支付'
    }
    if (status === 2) {
      return '已取消'
    }
  }
}

const mapState = state => ({
  details: state.order.details,
  dataSource:
    (state.order.details &&
      state.order.details.subOrderList &&
      state.order.details.subOrderList.length > 0 &&
      state.order.details.subOrderList) ||
    [],
})
const mapDispatch = dispatch => ({
  orderDetail: dispatch.order.orderDetail,
})
const Details = Form.create()(DetailsFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Details)
)
