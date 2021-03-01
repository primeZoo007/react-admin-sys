import React, { Component } from 'react'
import { Form, Modal, Input, Spin } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import style from './index.css'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
}

class ClassificationFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
    router: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount () {
    this.props.getCategory()
  }

  // 第一级
  search (id, key) {
    if (key !== this.state.parentKey) {
      this.props.resetsecCategory()
      this.props.getfirCategory({ parentId: id })
      this.setState({
        parentKey: key,
        firparentKey: null,
      })
    } else {
      this.props.resetfirCategory()
      this.setState({
        parentKey: null,
      })
    }
  }

  // 第二级
  searchfir (id, key) {
    if (key !== this.state.firparentKey) {
      this.props.getsecCategory({ parentId: id })
      this.setState({
        firparentKey: key,
        parentKey: this.state.parentKey,
      })
    } else {
      this.props.resetsecCategory()
      this.setState({
        firparentKey: null,
        parentKey: this.state.parentKey,
      })
    }
  }

  handleAdd (e, id) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      visible: true,
      id,
    })
  }

  handleFirAdd (e, id) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      visible: true,
      id,
      activeKey: 'first',
    })
  }

  handleFirEdit (e, id, value, index) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      editvisible: true,
      id,
      editValue: value,
      activeKey: 'first',
      editIndex: index,
    })
  }

  handleThiEdit (e, id, value, index) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      firparentKey: this.state.firparentKey,
      parentKey: this.state.parentKey,
      editvisible: true,
      id,
      editValue: value,
      activeKey: 'thi',
      editIndex: index,
    })
  }

  handleSecAdd (e, id) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      visible: true,
      id,
      activeKey: 'sec',
    })
  }

  handleSecEdit (e, id, value, index) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      editvisible: true,
      id,
      editValue: value,
      activeKey: 'sec',
      editIndex: index,
    })
  }

  handleDelete (e, id) {
    e.stopPropagation()
    e.preventDefault()
  }

  handleCancel () {
    this.setState({
      visible: false,
      editvisible: false,
    })
  }

  // 创建类目
  handleConfirm () {
    this.props.form.validateFields((e, values) => {
      if (!e) {
        if (this.state.id) {
          values.parentId = this.state.id
        }
        this.props.createCategory({ values, key: this.state.activeKey })
        this.setState({
          visible: false,
        })
      }
    })
  }

  // 编辑类目
  handleEditConfirm () {
    this.props.form.validateFields((e, values) => {
      if (!e) {
        if (this.state.id) {
          values.id = this.state.id
        }
        this.props.editCategory({
          values,
          key: this.state.activeKey,
          editIndex: this.state.editIndex,
        })
        this.setState({
          editvisible: false,
          // parentKey: null,
          // firparentKey: null,
        })
      }
    })
  }

  // 一级
  renderTreeNodes (data) {
    return data.map((item, index) => {
      return (
        <>
          <div
            className={style['parent-item']}
            key={item.id}
            onClick={() => this.search(item.id, index)}
          >
            <div className={style['icon-container']}>
              <div
                className={
                  this.state.parentKey === index
                    ? style['down-icon']
                    : style['up-icon']
                }
              />
              <div>{item.name}</div>
            </div>
            <div className={style['edit-btn-container']}>
              <a onClick={e => this.handleFirAdd(e, item.id, index)}>
                新增子分类
              </a>
              <a
                onClick={e => this.handleFirEdit(e, item.id, item.name, index)}
              >
                编辑
              </a>
            </div>
          </div>

          {this.state.parentKey === index
            ? this.renderFirNodes(this.props.fircategory)
            : null}
        </>
      )
    })
  }

  // 二级
  renderFirNodes (data) {
    return data.map((item, index) => {
      return (
        <>
          <div
            className={style['fir-parent-item']}
            key={item.id}
            onClick={() => this.searchfir(item.id, index)}
          >
            <div className={style['icon-container']}>
              <div
                className={
                  this.state.firparentKey === index
                    ? style['down-icon']
                    : style['up-icon']
                }
              />
              <div>{item.name}</div>
            </div>
            <div className={style['edit-btn-container']}>
              <a onClick={e => this.handleSecAdd(e, item.id, index)}>
                新增子分类
              </a>
              <a
                onClick={e => this.handleSecEdit(e, item.id, item.name, index)}
              >
                编辑
              </a>
            </div>
          </div>
          {this.state.firparentKey === index
            ? this.renderSecNodes(this.props.seccategory)
            : null}
        </>
      )
    })
  }

  // 三级
  renderSecNodes (data) {
    return data.map((item, index) => {
      return (
        <div className={style['sec-parent-item']} key={item.id}>
          <div>{item.name}</div>
          <div className={style['edit-btn-container']}>
            <a onClick={e => this.handleThiEdit(e, item.id, item.name, index)}>
              编辑
            </a>
          </div>
        </div>
      )
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <>
        <Spin spinning={this.props.tableLoading}>
          <div className="contaienr-box">
            <ContentBox>
              <Title>
                <button
                  className={style['add-btn']}
                  onClick={e => this.handleAdd(e)}
                >
                  新增分类
                </button>
              </Title>
              <div className={style['tree-container']}>
                {this.renderTreeNodes(this.props.category)}
                {/* {this.renderTreeNodes(this.state.treeData)} */}
              </div>
            </ContentBox>
            <Modal
              maskClosable={false}
              onCancel={this.handleCancel}
              visible={this.state.visible}
              footer={null}
              destroyOnClose
              title="创建类目"
            >
              <Form>
                <FormItem {...formItemLayout} label="分类名称">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入类目',
                      },
                    ],
                  })(<Input placeholder="请输入类目" />)}
                </FormItem>
              </Form>
              <div className={style['btn-container']}>
                <button
                  className={style['confirm']}
                  onClick={this.handleConfirm}
                >
                  确认
                </button>
                <button className={style['cancel']} onClick={this.handleCancel}>
                  取消
                </button>
              </div>
            </Modal>
            <Modal
              onCancel={this.handleCancel}
              maskClosable={false}
              visible={this.state.editvisible}
              footer={null}
              destroyOnClose
              title="编辑类目"
            >
              <Form>
                <FormItem {...formItemLayout} label="分类名称">
                  {getFieldDecorator('name', {
                    initialValue: this.state.editValue,
                    rules: [
                      {
                        required: true,
                        message: '请输入类目',
                      },
                    ],
                  })(<Input placeholder="请输入类目" />)}
                </FormItem>
              </Form>
              <div className={style['btn-container']}>
                <button
                  className={style['confirm']}
                  onClick={() => this.handleEditConfirm()}
                >
                  确认
                </button>
                <button className={style['cancel']} onClick={this.handleCancel}>
                  取消
                </button>
              </div>
            </Modal>
          </div>
        </Spin>
      </>
    )
  }
}

const mapState = state => ({
  category: state.shop.category || [],
  fircategory: state.shop.fircategory || [],
  seccategory: state.shop.seccategory || [],
  tableLoading: state.shop.tableLoading,
})
const mapDispatch = dispatch => ({
  createCategory: dispatch.shop.createCategory,
  getCategory: dispatch.shop.getCategory,
  getfirCategory: dispatch.shop.getfirCategory,
  resetfirCategory: dispatch.shop.resetfirCategory,
  getsecCategory: dispatch.shop.getsecCategory,
  resetsecCategory: dispatch.shop.resetsecCategory,
  editCategory: dispatch.shop.editCategory,
})
const Classification = Form.create()(ClassificationFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Classification)
)
