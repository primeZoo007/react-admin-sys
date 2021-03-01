import React, { Component } from 'react'
import { Form, Row, Col, Input, Table, Modal, message } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import style from './consumer.css'
import bridge from 'utils/bridge'

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

class ConsumerFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {
      pageNo: 1,
    }
    this.itemRender = this.itemRender.bind(this)
    this.handleConsumer = this.handleConsumer.bind(this)
    this.handleDetails = this.handleDetails.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
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
    this.startSearch()
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.consumerRequest && nextProps.consumerRequest) {
      message.success('消费成功')
      this.startSearch()
    }
  }

  // 确认消费
  handleConfirm () {
    this.props.consumer({
      orderId: this.state.editData.orderId,
    })
    bridge.screenLink(
      JSON.stringify({
        url: `/customer/consumption/${this.state.editData.orderId}`,
      })
    )
    this.setState({
      visible: false,
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
      this.props.getConsumerList(values)
    })
  }

  handleCancel () {
    this.setState({
      detailVisible: false,
      visible: false,
    })
  }

  handleDetails (record) {
    this.props.getList({
      orderId: record.orderId,
    })
    this.setState({
      detailVisible: true,
    })
  }

  handleConsumer (record) {
    this.setState({
      editData: record,
      visible: true,
    })
    bridge.screenLink(
      JSON.stringify({
        url: `/customer/consumption/${record.orderId}`,
      })
    )
  }

  render () {
    const { getFieldDecorator } = this.props.form

    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderId',
        key: 'orderId',
        align: 'center',
        width: 90,
      },
      {
        title: '宝宝姓名',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        width: 140,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center',
        width: 140,
      },
      {
        title: '服务名称',
        dataIndex: 'activityName',
        key: 'activityName',
        align: 'center',
        width: 90,
      },
      {
        title: '活动次数',
        dataIndex: 'totalCount',
        key: 'totalCount',
        align: 'center',
        width: 90,
      },
      {
        title: '剩余次数',
        dataIndex: 'remainCount',
        key: 'remainCount',
        align: 'center',
        width: 90,
      },
      {
        title: '活动订单状态',
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
        width: 130,
      },
      {
        title: '过期时间',
        dataIndex: 'validDate',
        key: 'validDate',
        align: 'center',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        width: 230,
        render: (text, record) => (
          <div className={style['btn-container']}>
            {record.valid && (
              <a
                onClick={() => this.handleConsumer(record)}
                className={style['fix']}
              >
                消费
              </a>
            )}
            <a
              onClick={() => this.handleDetails(record)}
              className={style['fix']}
            >
              查询详情
            </a>
          </div>
        ),
      },
    ]

    const decolumns = [
      {
        title: '消费时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        key: 'operator',
        align: 'center',
      },
    ]
    console.log('-----', this.props.total, this.props.loading)
    return (
      <div className="contaienr-box">
        <ContentBox>
          <div className={style['search-container']}>
            <Row gutter={24}>
              <Col span={8}>
                <Form>
                  <FormItem {...formItemLayout} label="会员手机">
                    {getFieldDecorator('mobile')(
                      <Input placeholder="输入会员手机号" />
                    )}
                  </FormItem>
                </Form>
              </Col>
              <Col span={8}>
                <Form>
                  <FormItem {...formItemLayout} label="宝宝姓名">
                    {getFieldDecorator('babyName')(
                      <Input placeholder="输入宝宝姓名" />
                    )}
                  </FormItem>
                </Form>
              </Col>
              <Col span={6} push={3}>
                <button onClick={this.handleSearch} className={style['select']}>
                  筛选
                </button>
              </Col>
            </Row>
          </div>
        </ContentBox>
        <ContentBox>
          <Table
            loading={this.props.loading}
            rowKey={(record, index) => index}
            dataSource={this.props.dataSource}
            columns={columns}
            pagination={{
              total: this.props.total,
              pageSize: PAGE_SIZE,
              onChange: this.pageChange,
              itemRender: this.itemRender,
            }}
          />
        </ContentBox>
        <Modal
          visible={this.state.visible}
          maskClosable={false}
          title="是否确认消费"
          onCancel={this.handleCancel}
          footer={null}
        >
          <div className={style['content-container']}>
            <div className={style['content']}>
              该活动订单当前剩余次数
              <span className={style['amount']}>
                {this.state.editData && this.state.editData.remainCount}
              </span>
              {/* ，消费后剩余次数<span className={style['amount']}>2</span> */}
            </div>
            <div className={style['btn-container']}>
              <button className={style['confirm']} onClick={this.handleConfirm}>
                确认消费
              </button>
              <button className={style['cancel']} onClick={this.handleCancel}>
                取消
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          maskClosable={false}
          visible={this.state.detailVisible}
          title="消费详情"
          onCancel={this.handleCancel}
          footer={null}
        >
          <Table
            rowKey={(record, index) => index}
            pagination={false}
            dataSource={this.props.conList}
            columns={decolumns}
          />
          <div className={style['know-container']}>
            <button className={style['know']} onClick={this.handleCancel}>
              知道了
            </button>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapState = state => ({
  consumerRequest: state.service.consumerRequest,
  loading: state.service.tableLoading,
  conList: (state.service.conList && state.service.conList.list) || [],
  total: (state.service.consumerList && state.service.consumerList.total) || 0,
  dataSource:
    (state.service.consumerList && state.service.consumerList.list) || [],
})
const mapDispatch = dispatch => ({
  getConsumerList: dispatch.service.getConsumerList,
  consumer: dispatch.service.consumer,
  getList: dispatch.service.getList,
})
const Consumer = Form.create()(ConsumerFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Consumer)
)
