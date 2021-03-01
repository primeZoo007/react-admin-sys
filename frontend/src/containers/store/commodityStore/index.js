import React, { Component } from 'react'
import { Form, Row, Col, Input, Table, Modal, message, DatePicker } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import bridge from 'utils/bridge'
import style from './index.css'
import { debounce } from 'utils'

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

class StoreFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {
      pageNo: 1,
      subOrderList: [],
    }
    this.itemRender = this.itemRender.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.hanldeDetail = this.hanldeDetail.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.moneyChange = this.moneyChange.bind(this)
    this.amountChange = this.amountChange.bind(this)
    this.editConfirm = this.editConfirm.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.addamountChange = this.addamountChange.bind(this)
    this.deleteInfo = this.deleteInfo.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  componentDidMount () {
    // this.props.getGoods({
    //   barcode: '6970643490169',
    // })
    this.startSearch()
    bridge.scanCode(response => {
      this.props.getGoods({
        barcode: (response && response.url) || '',
      })
    })
  }

  componentWillUnmount () {
    console.log('离开自有商品入库页面')
    bridge.clearScancode()
  };

  componentWillReceiveProps (nextProps) {
    const arr = this.state.subOrderList.slice(0)
    let isAlive = false
    if (!this.props.goodsRequest && nextProps.goodsRequest) {
      console.log('扫码后的结果', nextProps.goods)
      if (arr.length > 0) {
        arr.forEach(item => {
          if (item.barcode === nextProps.goods.barcode) {
            isAlive = true
            item.count = parseInt(item.count) + 1
          }
        })
        if (!isAlive) {
          arr.push(nextProps.goods)
        }
      } else {
        arr.push(nextProps.goods)
      }
      this.setState(
        {
          addVisible: true,
          subOrderList: arr,
        },
        () => {
          message.success('添加成功', 4)
        }
      )
    }
    if (!this.props.editRequest && nextProps.editRequest) {
      message.success('编辑成功', 4)
      this.startSearch()
    }
  }

  deleteInfo (index) {
    const arr = this.state.subOrderList.slice(0)
    arr.splice(index, 1)
    this.setState({
      subOrderList: arr,
    })
  }

  handleConfirm () {
    this.props.addGoods({ instockList: this.state.subOrderList })
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

  moneyChange (valur, record, index) {}
  amountChange (valur, record, index) {
    let arr = JSON.parse(JSON.stringify(this.props.details.instockList))
    let obj = this.props.details

    arr[index].count = valur
    obj.instockList = arr
    this.props.handleEdit(obj)
    this.setState({
      instockListIEdit: arr,
    })
  }
  // 编辑确认
  editConfirm () {
    let obj = this.props.details
    obj.instockList =
      this.state.instockListIEdit || this.props.details.instockList

    this.props.editGoodsStore(obj)
    this.setState({
      editVisible: false,
    })
  }

  addamountChange (valur, record, index) {
    const arr = JSON.parse(JSON.stringify(this.state.subOrderList))
    arr[index].count = valur
    this.setState({
      subOrderList: arr,
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
      if (values.time) {
        values.createTimeStart = Date.parse(values.time[0])
        values.createTimeEnd = Date.parse(values.time[1])
      }
      delete values.time
      this.props.getGoodsStore(values)
    })
  }

  handleReset () {
    this.props.form.resetFields()
    this.startSearch()
  }

  handleAdd () {
    this.setState({
      addVisible: true,
    })
  }

  handleEdit (record) {
    this.props.getGoodsStoreDetails({
      instockId: record.instockId,
    })
    this.setState({
      editVisible: true,
    })
  }

  hanldeDetail (record) {
    this.props.router.push(`/beinoen/commodity/details/${record.instockId}`)
  }

  render () {
    const { getFieldDecorator } = this.props.form

    const columns = [
      {
        title: '入库批次号',
        dataIndex: 'instockId',
        key: 'instockId',
        width: 120,
        align: 'center',
      },
      {
        title: '进货数',
        dataIndex: 'totalCount',
        key: 'totalCount',
        width: 90,
        align: 'center',
      },
      {
        title: '进货总价',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        align: 'center',
        width: 120,
      },
      {
        title: '入库单状态',
        dataIndex: 'statusString',
        key: 'statusString',
        align: 'center',
        width: 90,
      },
      {
        title: '操作人员',
        dataIndex: 'operator',
        key: 'operator',
        align: 'center',
        width: 90,
      },
      {
        title: '入库时间',
        dataIndex: 'instockTime',
        key: 'instockTime',
        align: 'center',
        width: 120,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        width: 120,
        render: (text, record) => (
          <div className={style['btn-box']}>
            <a
              className={style['edit']}
              onClick={() => this.handleEdit(record)}
            >
              编辑
            </a>
            <a
              className={style['details']}
              onClick={() => this.hanldeDetail(record)}
            >
              查看详情
            </a>
          </div>
        ),
      },
    ]

    const editColumns = [
      {
        title: '商品名称',
        dataIndex: 'commodityName',
        key: 'commodityName',
        align: 'center',
        width: 160,
      },
      {
        title: '商品SKU',
        dataIndex: 'commoditySkuId',
        key: 'commoditySkuId',
        align: 'center',
        width: 160,
      },
      {
        title: '商品条形码',
        dataIndex: 'barcode',
        key: 'barcode',
        align: 'center',
        width: 160,
      },
      {
        title: '进货单价',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        width: 90,
      },
      {
        title: '入库数量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        width: 160,
        render: (text, record, index) => (
          <Input
            onChange={e =>
              debounce(this.amountChange, 10)(e.target.value, record, index)
            }
            style={{ width: '80px' }}
            value={text}
          />
        ),
      },
    ]

    const addClumns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 140,
      },
      {
        title: '商品SKU',
        dataIndex: 'sku',
        key: 'sku',
        align: 'center',
        width: 140,
      },
      {
        title: '外部编码',
        dataIndex: 'thirdPartyCode',
        key: 'thirdPartyCode',
        align: 'center',
        width: 140,
      },
      {
        title: '商品分类',
        dataIndex: 'categoryName',
        key: 'categoryName',
        align: 'center',
        width: 140,
      },
      {
        title: '商品单价',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        width: 120,
      },
      {
        title: '购买数量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        width: 180,
        render: (text, record, index) => (
          <Input
            onChange={e =>
              debounce(this.addamountChange, 10)(e.target.value, record, index)
            }
            style={{ width: '150px' }}
            value={text}
          />
        ),
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        width: 120,
        render: (text, record, index) => (
          <a
            className={style[`add-norm`]}
            onClick={() => this.deleteInfo(index)}
          >
            删除
          </a>
        ),
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
          <Title>
            <button className={style['add-btn']} onClick={this.handleAdd}>
              自有商品入库
            </button>
          </Title>
          <div className={style['search-container']}>
            <Form>
              <Row gutter={24}>
                <Col span={9} push={0}>
                  <FormItem {...formItemLayout} label="入库批次号">
                    {getFieldDecorator('instockId')(
                      <Input placeholder="输入入库批次号" />
                    )}
                  </FormItem>
                </Col>
                <Col span={15}>
                  <FormItem
                    {...{
                      labelCol: {
                        sm: { span: 4 },
                      },
                      wrapperCol: {
                        sm: { span: 15 },
                      },
                    }}
                    label="时间"
                  >
                    {getFieldDecorator('time')(<RangePicker />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={6} push={18}>
                  <div className={style['search-btn-container']}>
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
            loading={this.props.loading}
            rowKey={(record, index) => index}
            dataSource={this.props.stocks}
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
          title="请用扫码枪扫描入库商品"
          width={864}
          maskClosable={false}
          visible={this.state.addVisible}
          onCancel={() => {
            this.setState({
              addVisible: false,
            })
          }}
          footer={null}
        >
          <Table
            rowKey={(record, index) => index}
            dataSource={this.state.subOrderList}
            columns={addClumns}
            pagination={false}
          />
          <div className={style['btn-container']}>
            <button onClick={this.handleConfirm}>确认入库</button>
          </div>
        </Modal>
        <Modal
          title="自有商品编辑"
          width={864}
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
          <Table
            rowKey={(record, index) => index}
            dataSource={this.props.instockList}
            columns={editColumns}
            pagination={false}
          />
          <div className={style['btn-container']}>
            <button onClick={this.editConfirm}>确认</button>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapState = state => ({
  loading: state.store.tableLoading,
  stocks: (state.store.stocks && state.store.stocks.list) || [],
  total: (state.store.stocks && state.store.stocks.total) || 0,
  details: state.store.details,
  instockList: (state.store.details && state.store.details.instockList) || [],
  goods: state.order.goods,
  goodsRequest: state.order.goodsRequest,
  editRequest: state.store.editRequest,
})
const mapDispatch = dispatch => ({
  addGoods: dispatch.store.addGoods,
  getGoodsStore: dispatch.store.getGoodsStore,
  getGoodsStoreDetails: dispatch.store.getGoodsStoreDetails,
  editGoodsStore: dispatch.store.editGoodsStore,
  getGoods: dispatch.order.getGoods,
  handleEdit: dispatch.store.handleEdit,
})
const Store = Form.create()(StoreFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Store)
)
