import React, { Component } from 'react'
import { Form, Row, Col, Input, Table, DatePicker, Modal } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
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

class OrderFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {
      pageNo: 1,
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.itemRender = this.itemRender.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleDetails = this.handleDetails.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.editConfirm = this.editConfirm.bind(this)
  }

  componentDidMount () {
    this.startSearch()
  }

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
  editConfirm () {
    let obj = this.props.details
    obj.instockList =
      this.state.instockListIEdit || this.props.details.instockList

    this.props.editGoodsStore(obj)
    this.setState({
      editVisible: false,
    })
  }

  handleReset () {
    this.props.form.resetFields()
    this.startSearch()
  }

  handleEdit (record) {
    this.props.getGoodsStoreDetails({
      instockId: record.instockId,
    })
    this.setState({
      editVisible: true,
    })
  }

  handleSearch () {
    this.startSearch()
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
      values.type = 1
      if (values.time) {
        values.createTimeStart = Date.parse(values.time[0])
        values.createTimeEnd = Date.parse(values.time[1])
      }
      delete values.time
      this.props.getGoodsStore(values)
    })
  }

  handleAdd () {
    this.props.router.push('/beinoen/shop/add')
  }

  handleDetails (record) {
    this.props.router.push(
      `/beinoen/bainuoenCommodity/details/${record.instockId}`
    )
  }

  render () {
    const { getFieldDecorator } = this.props.form

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
        title: '进货数量',
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

    const columns = [
      {
        title: '入库批次号',
        dataIndex: 'instockId',
        key: 'instockId',
        width: 120,
        align: 'center',
      },
      {
        title: '外部订单号',
        dataIndex: 'thirdPartyId',
        key: 'thirdPartyId',
        width: 90,
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
        width: 90,
        render: (text, record) => (
          <div className={style['btn-box']}>
            <a
              className={style['details']}
              onClick={() => this.handleDetails(record)}
            >
              查看详情
            </a>
          </div>
        ),
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
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
          title="编辑"
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
  total: (state.store.stocks && state.store.stocks.total) || 0,
  dataSource: (state.store.stocks && state.store.stocks.list) || [],
  instockList: (state.store.details && state.store.details.instockList) || [],
})
const mapDispatch = dispatch => ({
  getGoodsStore: dispatch.store.getGoodsStore,
  getGoodsStoreDetails: dispatch.store.getGoodsStoreDetails,
  editBainuoen: dispatch.store.editBainuoen,
})
const Order = Form.create()(OrderFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Order)
)
