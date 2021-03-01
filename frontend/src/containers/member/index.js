import React, { Component } from 'react'
import { Form, Row, Col, Input, Table, message, Modal } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import AddModal from 'components/member/add'
import EditModal from 'components/member/edit'
import RechargeModal from 'components/member/recharge'
import Bainuoen from './bainuoen'
import style from './index.css'

const confirm = Modal.confirm
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 15 },
  },
}
const PAGE_SIZE = 6

class MemberForm extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {
      pageNo: 1,
    }
    this.itemRender = this.itemRender.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleBainuoenAdd = this.handleBainuoenAdd.bind(this)
    this.handleAddOk = this.handleAddOk.bind(this)
    this.handleAddCancel = this.handleAddCancel.bind(this)
    this.handleEditCancel = this.handleEditCancel.bind(this)
    this.handleEditOk = this.handleEditOk.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.handleBainuoenOk = this.handleBainuoenOk.bind(this)
    this.handleBainuoenCancel = this.handleBainuoenCancel.bind(this)
    this.selectArea = this.selectArea.bind(this)
    this.selectCity = this.selectCity.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleRechargeCancel = this.handleRechargeCancel.bind(this)
    this.handleRecharge = this.handleRecharge.bind(this)
    this.handleRechargeOk = this.handleRechargeOk.bind(this)
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
    this.props.getProvince()
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
      this.props.getMembers(values)
    })
  }

  handleAdd () {
    this.setState({
      addVisible: true,
      addTitle: '添加会员',
      type: 'member',
    })
  }
  handleRecharge (e) {
    this.setState({
      rechargeVisible: true,
      rechargeTitle: '充值金额',
      name: e.name,
      memberId: e.id,
    })
  }

  handleEdit (e) {
    this.setState({
      editVisible: true,
      editTitle: '编辑会员',
      type: 'edit',
      editData: e,
    })
  }

  // 会员失效
  handleDelete (e) {
    confirm({
      title: '请确认是否使该会员失效?',
      onOk: () => {
        this.props.updateMember(
          {
            id: e.id,
            status: e.status === 0 ? 1 : 0,
          },
          () => {
            message.success('操作成功')
            this.startSearch()
          }
        )
      },
      onCancel: () => {},
    })
  }

  handleBainuoenAdd () {
    this.setState({
      bainuoenVisible: true,
    })
  }
  async handleRechargeOk (e) {
    let json = await this.props.handleRecharge(e)
    // eslint-disable-next-line eqeqeq
    if (json.success) {
      message.success('充值成功', 4)
      this.startSearch()
      this.setState({
        rechargeVisible: false,
      })
    }
  }
  handleAddOk (e) {
    if (!this.add) {
      this.add = true
      this.props.addMember(e, res => {
        if (res.success) {
          message.success('添加成功', 4)
          this.startSearch()
          this.add = false
          this.setState({
            addVisible: false,
          })
        } else {
          this.add = false
        }
      })
    }
  }

  handleAddCancel () {
    this.setState({
      addVisible: false,
    })
  }
  handleEditCancel () {
    this.setState({
      editVisible: false,
    })
  }
  handleRechargeCancel () {
    this.setState({
      rechargeVisible: false,
    })
  }

  handleEditOk (e) {
    if (!this.edit) {
      this.edit = true
      this.props.editMember(e, res => {
        if (res.success) {
          this.edit = false
          message.success('编辑成功', 4)
          this.startSearch()
          this.setState({
            editVisible: false,
          })
        } else {
          this.edit = false
        }
      })
    }
  }

  handleBainuoenOk (e) {
    if (!this.bainuoenClick) {
      this.bainuoenClick = true
      this.props.addBainuoenMember(e, res => {
        if (res.success) {
          this.bainuoenClick = false
          message.success('保存成功', 4)
          this.setState({
            bainuoenVisible: false,
          })
          this.startSearch()
        } else {
          this.bainuoenClick = false
        }
      })
    }
  }

  handleBainuoenCancel () {
    this.setState({
      bainuoenVisible: false,
    })
  }

  selectCity (e) {
    this.props.getCity({
      parentCode: e,
    })
  }

  selectArea (e) {
    this.props.getArea({
      parentCode: e,
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form

    const columns = [
      {
        title: '宝宝姓名',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 100,
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center',
        width: 120,
      },
      {
        title: '余额',
        dataIndex: 'balanceStr',
        key: 'balanceStr',
        align: 'center',
        width: 120,
      },
      {
        title: '会员类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 80,
        render: text => {
          if (text === 0) {
            return '正常'
          }
          if (text === 1) {
            return '失效'
          }
        },
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        align: 'center',
        width: 80,
        render: text => (text === 0 ? '男' : '女'),
      },
      {
        title: '宝宝生日',
        dataIndex: 'birthday',
        key: 'birthday',
        align: 'center',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        key: 'operate',
        width: 100,
        render: (text, record) => (
          <div className={style['btn-container']}>
            <a onClick={() => this.handleRecharge(record)} className={style['fix']}>
              充值
            </a>
            <a onClick={() => this.handleEdit(record)} className={style['fix']}>
              编辑
            </a>
            {record.status === 0 ? (
              <a
                onClick={() => this.handleDelete(record)}
                className={style['fix']}
              >
                失效
              </a>
            ) : (
              <a
                onClick={() => this.handleDelete(record)}
                className={style['fix']}
              >
                恢复
              </a>
            )}
          </div>
        ),
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
          <Title>
            <div className={style['add-btn-container']}>
              <button className={style['add-btn']} onClick={this.handleAdd}>
                新增会员
              </button>
              <button
                className={style['add-btn']}
                onClick={this.handleBainuoenAdd}
              >
                新增百诺恩会员
              </button>
            </div>
          </Title>
          <div className={style['search-container']}>
            <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="宝宝姓名">
                    {getFieldDecorator('name')(
                      <Input placeholder="输入姓名" />
                    )}
                  </FormItem>
                </Form>
              </Col>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="手机号">
                    {getFieldDecorator('mobile')(
                      <Input placeholder="输入手机号" />
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12} />
              <Col span={6} push={9}>
                <button onClick={this.handleSearch} className={style['select']}>
                  筛选
                </button>
              </Col>
            </Row>
          </div>
        </ContentBox>
        <ContentBox>
          <Table
            loading={this.props.tableLoading}
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
        <AddModal
          title={this.state.addTitle}
          addVisible={this.state.addVisible}
          handleOk={this.handleAddOk}
          handleCancel={this.handleAddCancel}
        />
        <EditModal
          editData={this.state.editData}
          title={this.state.editTitle}
          editVisible={this.state.editVisible}
          handleCancel={this.handleEditCancel}
          handleOk={this.handleEditOk}
        />
        <Bainuoen
          title="新增百诺恩会员"
          addVisible={this.state.bainuoenVisible}
          handleOk={this.handleBainuoenOk}
          handleCancel={this.handleBainuoenCancel}
          province={this.props.province}
          city={this.props.city}
          area={this.props.area}
          selectCity={this.selectCity}
          selectArea={this.selectArea}
        />
        <RechargeModal
          title={this.state.rechargeTitle}
          rechargeVisible={this.state.rechargeVisible}
          name={this.state.name}
          memberId={this.state.memberId}
          handleCancel={this.handleRechargeCancel}
          handleOk={this.handleRechargeOk}
        />
      </div>
    )
  }
}

const mapState = state => ({
  total: state.member.members.total || 0,
  dataSource: state.member.members.list || [],
  tableLoading: state.member.tableLoading,
  province: state.common.province,
  city: state.common.city,
  area: state.common.area,
})
const mapDispatch = dispatch => ({
  handleRecharge: dispatch.member.handleRecharge,
  getMembers: dispatch.member.getMembers,
  addMember: dispatch.member.addMember,
  editMember: dispatch.member.editMember,
  addBainuoenMember: dispatch.member.addBainuoenMember,
  getProvince: dispatch.common.getProvince,
  getCity: dispatch.common.getCity,
  getArea: dispatch.common.getArea,
  updateMember: dispatch.member.updateMember,
})
const Member = Form.create()(MemberForm)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Member)
)
