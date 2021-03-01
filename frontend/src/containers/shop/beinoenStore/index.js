import React, { Component } from 'react'
import { Form, Row, Col, Input, Table, Modal, message } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import bridge from 'utils/bridge'
import style from './index.css'

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
    total: PropTypes.number,
    dataSource: PropTypes.array,
  }
  constructor (props) {
    super(props)
    this.state = {
      pageNo: 1,
    }
    this.itemRender = this.itemRender.bind(this)
    this.handleFix = this.handleFix.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.editConfirm = this.editConfirm.bind(this)
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

  componentWillReceiveProps (nextProps) {
    if (!this.props.goods && nextProps.goods) {
      this.setState({
        editData: nextProps.goods,
        editVisible: true,
      })
    }
  }

  componentDidMount () {
    this.startSearch()
    bridge.scanCode(response => {
      console.log('扫码枪回调', response)
      this.props.getBainuoenGoods({
        pageNo: this.state.pageNo,
        pageSize: PAGE_SIZE,
        barcode: (response && response.url) || '',
      })
      this.props.getGoods({
        barcode: (response && response.url) || '',
      })
    })
  }

  componentWillUnmount () {
    console.log('离开百诺恩商品库页面')
    bridge.clearScancode()
  };

  handleFix () {
    this.props.router.push('/beinoen/shop/fix')
  }

  handleSearch () {
    this.startSearch()
  }

  pageChange (pageNo) {
    this.setState({ pageNo }, () => {
      this.startSearch()
    })
  }

  // 编辑
  handleEdit (record) {
    this.setState({
      editData: record,
      editVisible: true,
    })
  }

  // 确认编辑
  editConfirm () {
    this.props.form.validateFields((e, values) => {
      this.props.editBainuoen(
        {
          stock: values.stock,
          id:
            (this.state.editData && this.state.editData.id) ||
            (this.state.editData && this.state.editData.commodityId),
        },
        () => {
          this.setState({
            editVisible: false,
          })
          message.success('编辑成功', 4)
          this.props.form.resetFields()
          this.startSearch()
        }
      )
    })
  }

  startSearch () {
    const { pageNo } = this.state
    this.props.form.validateFields((e, values) => {
      values.pageNo = pageNo
      values.pageSize = PAGE_SIZE
      this.props.getBainuoenGoods(values)
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form

    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 90,
      },
      {
        title: '条形码 ',
        dataIndex: 'thirdPartyId',
        key: 'thirdPartyId',
        align: 'center',
        width: 90,
      },
      {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock',
        align: 'center',
        width: 90,
      },
      {
        title: '商品价格',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        width: 90,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        width: 90,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        align: 'center',
        width: 90,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        width: 90,
        render: (text, record) => (
          <a
            className={style['details']}
            onClick={() => this.handleEdit(record)}
          >
              编辑
          </a>
        ),
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
          <div className={style['search-container']}>
            <Row gutter={24}>
              <Col span={10} pull={1}>
                <Form>
                  <FormItem {...formItemLayout} label="商品名称">
                    {getFieldDecorator('name')(
                      <Input placeholder="输入商品名称" />
                    )}
                  </FormItem>
                </Form>
              </Col>
              <Col span={6} push={11}>
                <button onClick={this.handleSearch} className={style['select']}>
                  筛选
                </button>
              </Col>
            </Row>
          </div>
        </ContentBox>
        <ContentBox>
          <Table
            rowKey={(record, index) => index}
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
        <Modal
          title="编辑"
          maskClosable={false}
          visible={this.state.editVisible}
          footer={null}
          pagination={false}
          onCancel={() => {
            this.setState({
              editVisible: false,
            })
          }}
        >
          <Form>
            <FormItem
              {...{
                labelCol: {
                  sm: { span: 5 },
                },
                wrapperCol: {
                  sm: { span: 15 },
                },
              }}
              label="库存"
            >
              {getFieldDecorator('stock', {
                initialValue: this.state.editData && this.state.editData.stock,
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Form>
          <div className={style['btn-container']}>
            <button onClick={this.editConfirm}>确认</button>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapState = state => ({
  loading: state.shop.tableLoading,
  total: state.shop.bainuoenGoods && state.shop.bainuoenGoods.total,
  dataSource: state.shop.bainuoenGoods && state.shop.bainuoenGoods.list,
  goods: state.shop.goods,
})
const mapDispatch = dispatch => ({
  getBainuoenGoods: dispatch.shop.getBainuoenGoods,
  editBainuoen: dispatch.store.editBainuoen,
  getGoods: dispatch.shop.getGoods,
})
const Store = Form.create()(StoreFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Store)
)
