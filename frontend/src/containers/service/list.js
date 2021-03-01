import React, { Component } from 'react'
import { Form, Row, Col, Input, Table, message, Select } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import style from './list.css'

const { Option } = Select
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

class ListFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
    getServiceList: PropTypes.func,
  }
  constructor (props) {
    super(props)
    this.state = {
      pageNo: 1,
    }
    this.itemRender = this.itemRender.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.handleReset = this.handleReset.bind(this)
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
    if (!this.props.closeRequest && nextProps.closeRequest) {
      message.success('服务已关闭', 4)
      this.startSearch()
    }
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
      values.name = values.name || null
      this.props.getServiceList(values)
    })
  }

  handleAdd () {
    this.props.router.push('/beinoen/service/new')
  }

  handleEdit (record) {
    this.props.router.push(`/beinoen/service/details/${record.id}`)
  }

  handleClose (record) {
    this.props.closeService({ activityId: record.id })
  }

  handleReset () {
    this.props.form.resetFields()
  }

  render () {
    const { getFieldDecorator } = this.props.form

    const columns = [
      {
        title: '活动名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '优惠规则',
        dataIndex: 'rules',
        key: 'rules',
        align: 'center',
      },
      {
        title: '活动价格',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      },
      {
        title: '服务时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        render: (text, record) => {
          return record.startTime + '~' + record.endTime
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width: 180,
        align: 'center',
        render: (text, record) => (
          <div className={style['btn-container']}>
            <a onClick={() => this.handleEdit(record)} className={style['fix']}>
              查看详情
            </a>
            {record.status === 0 ? (
              <a
                onClick={() => this.handleClose(record)}
                className={style['fix']}
              >
                关闭
              </a>
            ) : (
              <span className={style['close']}>已关闭</span>
            )}
          </div>
        ),
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
          <Title>
            <button className={style['add-btn']} onClick={this.handleAdd}>
              新增服务
            </button>
          </Title>
          <div className={style['search-container']}>
            <Row gutter={24}>
              <Col span={10} pull={1}>
                <Form>
                  <FormItem {...formItemLayout} label="活动名称">
                    {getFieldDecorator('name')(
                      <Input placeholder="输入活动名称" />
                    )}
                  </FormItem>
                </Form>
              </Col>
              <Col span={9} pull={1}>
                <Form>
                  <FormItem {...formItemLayout} label="是否关闭">
                    {getFieldDecorator('status')(
                      <Select placeholder="请选择">
                        <Option value={1}>已关闭</Option>
                        <Option value={0}>未关闭</Option>
                      </Select>
                    )}
                  </FormItem>
                </Form>
              </Col>
              <Col span={5}>
                <div className={style['btn-container']}>
                  <button
                    onClick={this.handleReset}
                    className={style['select']}
                  >
                    重置
                  </button>
                  <button
                    onClick={this.handleSearch}
                    className={style['select']}
                  >
                    筛选
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        </ContentBox>
        <ContentBox>
          <Table
            rowKey={(record, index) => index}
            loading={this.props.tableLoading}
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
      </div>
    )
  }
}

const mapState = state => ({
  dataSource: state.service.serviceList.list || [],
  total: state.service.serviceList.total || 0,
  tableLoading: state.service.tableLoading,
  closeRequest: state.service.closeRequest,
})
const mapDispatch = dispatch => ({
  getServiceList: dispatch.service.getServiceList,
  closeService: dispatch.service.closeService,
})
const List = Form.create()(ListFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(List)
)
