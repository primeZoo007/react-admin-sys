import React, { Component } from 'react'
import { Form, Row, Col, Input, Table, DatePicker } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import style from './order.css'

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

class OrderFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.itemRender = this.itemRender.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleDetails = this.handleDetails.bind(this)
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
    this.props.router.push('/beinoen/shop/add')
  }

  handleDetails () {
    this.props.router.push('/beinoen/bainuoenCommodity/details')
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const dataSource = []

    const columns = [
      {
        title: '入库单号',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '外部订单号SKU',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '商品数量',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '入库单状态',
        dataIndex: 'address',
        key: 'address1',
      },
      {
        title: '创建时间',
        dataIndex: 'address',
        key: 'address5',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: text => (
          <a className={style['fix']} onClick={this.handleDetails}>
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
                  <FormItem {...formItemLayout} label="入库单号">
                    {getFieldDecorator('name')(
                      <Input placeholder="输入入库单号" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="外部订单号">
                    {getFieldDecorator('name', {})(
                      <Input placeholder="输入外部订单号" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="商品名称">
                    {getFieldDecorator('name', {})(
                      <Input placeholder="商品名称" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={11} pull={1}>
                  <FormItem {...formItemLayout} label="下单时间">
                    {getFieldDecorator('d')(<RangePicker />)}
                  </FormItem>
                </Col>
                <Col span={6} push={8}>
                  <button className={style['select']}>筛选</button>
                </Col>
              </Row>
            </Form>
          </div>
        </ContentBox>
        <ContentBox>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
              pageSize: PAGE_SIZE,
              onChange: this.pageChange,
              itemRender: this.itemRender,
            }}
          />
        </ContentBox>
      </div>
    )
  }
}

const mapState = state => ({})
const mapDispatch = dispatch => ({
  login: dispatch.common.createLogin,
})
const Order = Form.create()(OrderFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Order)
)
