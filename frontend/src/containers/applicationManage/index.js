import React, { Component } from 'react'
import { Input, Form, Button, Row, Col, Table, Modal } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import { debounce } from 'utils'
import PropTypes from 'prop-types'

import './index.css'

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

class IndexFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {
      pageNo: 1,
    }
    this.handleCreate = this.handleCreate.bind(this) // 新建
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSearch = this.handleSearch.bind(this) // 查询
    this.pageChange = this.pageChange.bind(this)
    this.inputChange = this.inputChange.bind(this)
  }

  componentDidMount () {
    this.props.getApplication({
      pageSize: PAGE_SIZE,
      pageNo: this.state.pageNo,
    })
  }

  // 新建
  handleCreate () {
    this.props.editModalVisible(true)
  }

  handleOk () {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        this.props.createApplication({
          name: values.addName,
        })
      }
    })
  }

  handleCancel () {
    this.props.editModalVisible(false)
  }

  // 查看详情
  handleCheck (id) {
    this.props.router.push(`/tracker/burying/points/${id}`)
  }

  // 查询
  handleSearch () {
    this.props.getApplication({
      pageSize: PAGE_SIZE,
      pageNo: this.state.pageNo,
      name: this.state.name,
    })
  }

  inputChange (value) {
    this.setState({
      name: value,
    })
  }

  pageChange (pageNo) {
    this.setState({
      pageNo,
    })
    this.props.getApplication({
      pageSize: PAGE_SIZE,
      pageNo: pageNo,
      name: this.state.name,
    })
  }

  _renderCol () {
    return [
      {
        title: '应用名称',
        dataIndex: 'name',
      },
      {
        title: '应用Id',
        dataIndex: 'id',
      },
      {
        title: '创建时间',
        dataIndex: 'time',
        render: text => {
          return text || '-'
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        render: (text, record) => {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() => this.handleCheck(record.id)}
            >
              查看详情
            </Button>
          )
        },
      },
    ]
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { applicationList, tableLoading, modalVisible } = this.props
    return (
      <div className="contaienr-box">
        <div className="search-box">
          <Row gutter={24}>
            <Col span={6}>
              <FormItem {...formItemLayout} label="应用名称">
                {getFieldDecorator('name', {})(
                  <Input
                    placeholder="请输入应用名称"
                    onChange={e =>
                      debounce(this.inputChange, 500)(e.target.value)
                    }
                  />
                )}
              </FormItem>
            </Col>
            {/* <Col span={6}>
              <FormItem {...formItemLayout} label="应用Id">
                {getFieldDecorator('test', {})(
                  <Input
                    onChange={e =>
                      debounce(this.inputChange, 500)(e.target.value)
                    }
                  />
                )}
              </FormItem>
            </Col> */}
          </Row>
          <Row>
            <Col span={6} offset={20}>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <Button onClick={this.handleCreate}>新建</Button>
            </Col>
          </Row>
        </div>
        <div className="table-box">
          <Table
            loading={tableLoading}
            rowKey={record => record.id}
            dataSource={applicationList.list}
            columns={this._renderCol()}
            pagination={{
              pageSize: PAGE_SIZE,
              onChange: this.pageChange,
              total: applicationList.total,
            }}
          />
        </div>
        <Modal
          destroyOnClose
          maskClosable={false}
          visible={modalVisible}
          title="新建"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row gutter={24}>
            <Col span={12} offset={4}>
              <FormItem {...formItemLayout} label="应用名称">
                {getFieldDecorator('addName', {
                  rules: [{ required: true, message: '请填写埋点名称' }],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}

const mapState = state => ({
  applicationList:
    state.applicationManage && state.applicationManage.applicationList,
  tableLoading: state.applicationManage.tableLoading,
  modalVisible: state.applicationManage.modalVisible,
})

const mapDispatch = dispatch => ({
  getApplication: dispatch.applicationManage.getApplication,
  createApplication: dispatch.applicationManage.createApplication,
  editTableLoading: dispatch.applicationManage.editTableLoading,
  editModalVisible: dispatch.applicationManage.editModalVisible,
})
const Index = Form.create()(IndexFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Index)
)
