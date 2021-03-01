import React, { Component } from 'react'
import { Form, Row, Col, Select, Input, Table, Modal } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import style from './index.css'

const confirm = Modal.confirm
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

class StoreFrom extends Component {
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
    this.handleSearch = this.handleSearch.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.firChange = this.firChange.bind(this)
    this.secChange = this.secChange.bind(this)
    this.thiChange = this.thiChange.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  // 一级类目
  firChange (e, option) {
    this.setState({
      categoryId: e,
      first: option.props.children,
      second: undefined,
      third: undefined,
    })
    this.props.getfirCategory({ parentId: e })
  }
  // 二级类目
  secChange (e, option) {
    this.setState({
      categoryId: e,
      second: option.props.children,
      third: undefined,
    })
    this.props.getsecCategory({ parentId: e })
  }
  // 三级类目
  thiChange (e, option) {
    this.setState({
      categoryId: e,
      third: option.props.children,
    })
  }

  // 重置
  handleReset () {
    this.props.form.resetFields()
    this.props.resetCategory()
    this.setState(
      {
        categoryId: null,
        first: undefined,
        second: undefined,
        third: undefined,
      },
      () => {
        this.startSearch()
      }
    )
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
    this.props.getCategory()
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
      values.categoryId = this.state.categoryId
      this.props.getOwnGoods(values)
    })
  }

  // 新增自有商品
  handleAdd () {
    this.props.router.push('/beinoen/shop/add')
  }

  // 编辑
  handleEdit (record) {
    this.props.router.push(`/beinoen/shop/edit/${record.id}`)
  }

  // 删除
  handleDelete (record) {
    confirm({
      title: '请确认是否要删除该商品?',
      onOk: () => {
        this.props.deleteOwnGoods(
          {
            id: record.id,
          },
          () => {
            this.startSearch()
          }
        )
      },
      onCancel: () => {},
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const columns = [
      {
        title: '商品ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '商品信息',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '商品分类',
        dataIndex: 'categoryName',
        key: 'categoryName',
        align: 'center',
        render: text => text || '-',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        render: (text, record) => (
          <div className={style['btn-container']}>
            <a className={style['fix']} onClick={() => this.handleEdit(record)}>
              编辑
            </a>
            <a
              className={style['fix']}
              onClick={() => this.handleDelete(record)}
            >
              删除
            </a>
          </div>
        ),
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
          <Title>
            <button className={style['add-btn']} onClick={this.handleAdd}>
              新增自有商品
            </button>
          </Title>
          <div className={style['search-container']}>
            <Form>
              <Row gutter={24}>
                <Col span={10} pull={1}>
                  <FormItem {...formItemLayout} label="商品名称">
                    {getFieldDecorator('name')(
                      <Input placeholder="输入商品名称" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={18} pull={4}>
                  <FormItem {...formItemLayout} label="商品分类">
                    {getFieldDecorator('type', {})(
                      <>
                        <div className={style['category-container']}>
                          <Select
                            placeholder="一级分类"
                            value={this.state.first}
                            className={style['pright']}
                            onChange={this.firChange}
                          >
                            {this.props.category.map(item => {
                              return (
                                <Option key={1} value={item.id}>
                                  {item.name}
                                </Option>
                              )
                            })}
                          </Select>
                          <Select
                            placeholder="二级分类"
                            value={this.state.second}
                            className={style['pright']}
                            onChange={this.secChange}
                          >
                            {this.props.firCategory.map(item => {
                              return (
                                <Option key={1} value={item.id}>
                                  {item.name}
                                </Option>
                              )
                            })}
                          </Select>
                          <Select
                            placeholder="三级分类分类"
                            value={this.state.third}
                            onChange={this.thiChange}
                          >
                            {this.props.secCategory.map(item => {
                              return (
                                <Option key={1} value={item.id}>
                                  {item.name}
                                </Option>
                              )
                            })}
                          </Select>
                        </div>
                      </>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6} push={19}>
                  <div className={style['select-container']}>
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
            </Form>
          </div>
        </ContentBox>
        <ContentBox>
          <Table
            rowKey={(record, index) => index}
            loading={this.props.tabl}
            dataSource={this.props.dataSource}
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
  tableLoading: state.shop.tableLoading,
  dataSource: (state.shop.ownGoods && state.shop.ownGoods.list) || [],
  total: (state.shop.ownGoods && state.shop.ownGoods.total) || 0,
  category: state.shop.category || [],
  firCategory: (state.shop && state.shop.fircategory) || [],
  secCategory: (state.shop && state.shop.seccategory) || [],
})
const mapDispatch = dispatch => ({
  getOwnGoods: dispatch.shop.getOwnGoods,
  getCategory: dispatch.shop.getCategory,
  getfirCategory: dispatch.shop.getfirCategory,
  getsecCategory: dispatch.shop.getsecCategory,
  deleteOwnGoods: dispatch.shop.deleteOwnGoods,
  resetCategory: dispatch.shop.resetCategory,
})
const Store = Form.create()(StoreFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Store)
)
