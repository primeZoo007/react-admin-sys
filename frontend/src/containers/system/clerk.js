import React, { Component } from 'react'
import { Form, Row, Col, Input, Table, Modal, message } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import Add from './add'
import Edit from './edit'
import Power from './power'

import style from './clerk.css'

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

class ClerkFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
    getClerks: PropTypes.func,
  }
  constructor (props) {
    super(props)
    this.state = {
      pageNo: 1,
    }
    this.itemRender = this.itemRender.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.handleAddConfirm = this.handleAddConfirm.bind(this)
    this.onCheck = this.onCheck.bind(this)
    this.powerConfirm = this.powerConfirm.bind(this)
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
    this.setState({
      addVisible: true,
      title: '新增店员账号',
    })
  }

  handleAddConfirm (e) {
    this.props.addClerk(e)
    this.setState({
      addVisible: false,
    })
  }

  componentDidMount () {
    this.startSearch()
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.powerRequest && nextProps.powerRequest) {
      message.success('权限编辑成功', 4)
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
      values.id = values.id || null
      values.name = values.name || null
      this.props.getClerks(values)
    })
  }

  handlePower (record) {
    let recordArr = ['shopStore', 'shopClass', 'bainuoenClass', 'orderCreate', 'orderList', 'shopStore', 'bainuoenStore', 'stockWater', 'serviceList', 'serviceConsume', 'pickOrder', 'memberManager', 'memberTradeWater',
      'salesStatistics', 'systemClerk', 'systemPay', 'systemPassword',
    ]// 删除目录中的二级菜单
    recordArr.map(item => {
      // eslint-disable-next-line eqeqeq
      if (record.power.indexOf(item) != -1) {
        record.power.splice(record.power.indexOf(item), 1)
      }
    })
    this.setState({
      selectedKeys: record.power || [],
      powerData: record,
      powerVisible: true,
      title: '权限设置',
    })
  }

  handleReset (data) {
    Modal.confirm({
      title: '请确认是否要重置店员密码',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.resetPassword({ id: data.id })
      },
    })
  }

  handleEdit (data) {
    this.setState({
      editData: data,
      editVisible: true,
      title: '编辑店员账号',
    })
  }

  handleConfirm (e) {
    this.props.editClerk(e)
    this.setState({
      editVisible: false,
    })
  }

  handleDelete (data) {
    Modal.confirm({
      title: '请确认是否要删除店员信息',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.deleteClerk({ id: data.id })
      },
    })
  }

  handleCancel () {
    this.setState({
      addVisible: false,
      editVisible: false,
      powerVisible: false,
    })
  }

  // 选择权限管理
  onCheck (keys, info) {
    this.setState({
      selectedKeys: keys,
      info,
    })
  }

  filter (data) {
    const arr = []
    data.forEach(element => {
      arr.push(element.node.props)
    })
  }

  // 保存权限
  powerConfirm () {
    this.props.authManage(
      {
        power: this.state.selectedKeys,
        clerkId: this.state.powerData.id,
      },
      () => {
        this.startSearch()
      }
    )
    this.handleCancel()
  }

  render () {
    const { getFieldDecorator } = this.props.form

    const columns = [
      {
        title: '店员姓名',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 120,
      },
      {
        title: '店员手机',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center',
        width: 130,
      },
      {
        title: '账号状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 120,
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
        width: 360,
        render: (text, record) => (
          <div className={style['btn-container']}>
            <a
              onClick={() => this.handlePower(record)}
              className={style['fix']}
            >
              权限管理
            </a>
            <a
              onClick={() => this.handleReset(record)}
              className={style['fix']}
            >
              重置密码
            </a>
            <a onClick={() => this.handleEdit(record)} className={style['fix']}>
              编辑
            </a>
            <a
              onClick={() => this.handleDelete(record)}
              className={style['fix']}
            >
              删除
            </a>
          </div>
        ),
      },
    ]
    return (
      <>
        <div className="contaienr-box">
          <ContentBox>
            <Title>
              <button className={style['add-btn']} onClick={this.handleAdd}>
                新增店员账号
              </button>
            </Title>
            <div className={style['search-container']}>
              <Row gutter={24}>
                <Col span={10} pull={1}>
                  <Form>
                    <FormItem {...formItemLayout} label="店员姓名">
                      {getFieldDecorator('name')(
                        <Input placeholder="输入店员姓名" />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="店员手机号">
                      {getFieldDecorator('mobile', {})(
                        <Input placeholder="输入店员手机号" />
                      )}
                    </FormItem>
                  </Form>
                </Col>
                <Col span={6} push={11}>
                  <button
                    onClick={this.handleSearch}
                    className={style['select']}
                  >
                    筛选
                  </button>
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
        <Add
          handleAddConfirm={this.handleAddConfirm}
          handleCancel={this.handleCancel}
          title={this.state.title}
          addVisible={this.state.addVisible}
        />
        <Edit
          data={this.state.editData}
          handleCancel={this.handleCancel}
          title={this.state.title}
          editVisible={this.state.editVisible}
          handleConfirm={this.handleConfirm}
        />
        <Power
          selectedKeys={this.state.selectedKeys || []}
          handleCancel={this.handleCancel}
          title={this.state.title}
          powerVisible={this.state.powerVisible}
          powerCheck={this.onCheck}
          powerConfirm={this.powerConfirm}
        />
      </>
    )
  }
}

const mapState = state => ({
  dataSource: (state.system.clerks && state.system.clerks).list || [],
  total: (state.system.clerks && state.system.clerks).total || 0,
  tableLoading: state.system.tableLoading,
  powerRequest: state.system.powerRequest,
})
const mapDispatch = dispatch => ({
  getClerks: dispatch.system.getClerks,
  addClerk: dispatch.system.addClerk,
  resetPassword: dispatch.system.resetPassword,
  editClerk: dispatch.system.editClerk,
  deleteClerk: dispatch.system.deleteClerk,
  authManage: dispatch.system.authManage,
})
const Clerk = Form.create()(ClerkFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Clerk)
)
