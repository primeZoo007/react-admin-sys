import React, { Component } from 'react'
import { Input, Form, Button, Row, Col, Table, Modal, Select } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import { debounce } from 'utils'

import './index.css'

const Option = Select.Option
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
      visible: false,
      pageNo: 1,
      ponitType: [
        {
          value: 1,
          label: 'CLICK',
        },
        {
          value: 2,
          label: 'PV',
        },
        {
          value: 3,
          label: 'TP',
        },
        {
          value: 4,
          label: 'LAUNCH',
        },
        {
          value: 5,
          label: 'UNLOAD',
        },
      ],
    }
    this.handleCreate = this.handleCreate.bind(this) // 新建
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSearch = this.handleSearch.bind(this) // 查询
    this.pageChange = this.pageChange.bind(this) // 分页
    this.inputChange = this.inputChange.bind(this)
    this.typeChange = this.typeChange.bind(this)
  }

  componentDidMount () {
    this.props.getPoints({
      appId: this.props.match.params.id,
      pageSize: PAGE_SIZE,
      pageNo: this.state.pageNo,
    })
  }

  // 新建
  handleCreate () {
    this.props.editModalVisible(true)
  }

  // 查询
  handleSearch () {
    this.props.getPoints({
      appId: this.props.match.params.id,
      pageSize: PAGE_SIZE,
      pageNo: this.state.pageNo,
      name: this.state.name,
      type: this.state.type,
    })
  }

  handleOk () {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        this.props.createPoints({
          name: values.addName,
          type: values.addType,
          appId: this.props.match.params.id,
        })
      }
    })
  }

  handleCancel () {
    this.props.editModalVisible(false)
  }

  pageChange () {}

  inputChange (value) {
    this.setState({
      name: value,
    })
  }

  typeChange (value) {
    this.setState({
      type: value,
    })
  }

  _renderCol () {
    return [
      {
        title: '埋点id',
        dataIndex: 'id',
      },
      {
        title: '埋点名称',
        dataIndex: 'name',
      },
      {
        title: '埋点类型',
        dataIndex: 'type',
        render: (text, record) => {
          switch (record.type) {
            case 1:
              return 'CLICK'
            case 2:
              return 'PV'
            case 3:
              return 'TP'
            case 4:
              return 'LAUNCH'
            case 5:
              return 'UNLOAD'
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
    ]
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { ponitType } = this.state
    const { pointsList, modalVisible, tableLoading } = this.props
    return (
      <div className="contaienr-box">
        <div className="search-box">
          <Row gutter={24}>
            <Col span={6}>
              <FormItem {...formItemLayout} label="埋点名称">
                {getFieldDecorator('name', {})(
                  <Input
                    placeholder="请输入埋点名称"
                    onChange={e =>
                      debounce(this.inputChange, 500)(e.target.value)
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label="埋点类型">
                {getFieldDecorator('type', {})(
                  <Select
                    style={{ width: 160 }}
                    placeholder="请选择埋点类型"
                    onChange={this.typeChange}
                  >
                    {ponitType.map(item => {
                      return <Option value={item.value}>{item.label}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
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
            dataSource={pointsList.list}
            columns={this._renderCol()}
            pagination={{
              pageSize: PAGE_SIZE,
              onChange: this.pageChange,
              total: pointsList.total,
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
              <FormItem {...formItemLayout} label="埋点名称">
                {getFieldDecorator('addName', {
                  rules: [{ required: true, message: '请填写埋点名称' }],
                })(
                  <Input style={{ width: 160 }} placeholder="请填写埋点名称" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12} offset={4}>
              <FormItem {...formItemLayout} label="埋点类型">
                {getFieldDecorator('addType', {
                  rules: [{ required: true, message: '请选择埋点类型' }],
                })(
                  <Select style={{ width: 160 }} placeholder="请选择埋点类型">
                    {ponitType.map(item => {
                      return <Option value={item.value}>{item.label}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}

const mapState = state => ({
  pointsList: state.buryingPoints.pointsList,
  tableLoading: state.buryingPoints.tableLoading,
  modalVisible: state.buryingPoints.modalVisible,
})

const mapDispatch = dispatch => ({
  getPoints: dispatch.buryingPoints.getPoints,
  createPoints: dispatch.buryingPoints.createPoints,
  editTableLoading: dispatch.buryingPoints.editTableLoading,
  editModalVisible: dispatch.buryingPoints.editModalVisible,
})

const Index = Form.create()(IndexFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Index)
)
