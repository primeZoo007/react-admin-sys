import React, { Component } from 'react'
import { Form, Row, Col, Input, Table, DatePicker, Modal, Select } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import Title from 'components/Title'
import ContentBox from 'components/ContentBox'
import style from './index.css'

const Option = Select.Option
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

class waterForm extends Component {
    static propTypes = {
      form: PropTypes.object,
    }
    constructor (props) {
      super(props)
      this.state = {
        commodityType: [{
          id: 0,
          name: '自由商品',
        }, {
          id: 1,
          name: '百诺恩商品',
        }],
        operTypeList: [{
          id: 1,
          name: '自有商品库-新增',
        }, {
          id: 2,
          name: '自有商品库-编辑',
        }, {
          id: 3,
          name: '百诺恩商品库-新增',
        }, {
          id: 4,
          name: '创建订单',
        }, {
          id: 5,
          name: '取消订单',
        }, {
          id: 6,
          name: '自有商品入库-新增',
        }, {
          id: 7,
          name: '自有商品入库-编辑',
        }, {
          id: 8,
          name: '百诺恩商品入库-新增',
        }, {
          id: 9,
          name: '百诺恩商品入库-编辑',
        }],
        pageNo: 1,
      }
      this.handleSearch = this.handleSearch.bind(this)
      this.itemRender = this.itemRender.bind(this)
      this.handleDetails = this.handleDetails.bind(this)
      this.pageChange = this.pageChange.bind(this)
      this.handleReset = this.handleReset.bind(this)
      this.handleEdit = this.handleEdit.bind(this)
      this.editConfirm = this.editConfirm.bind(this)
    }

    componentDidMount () {
      this.startSearch()
      this.props.getClerks({
        pageSize: 1000,
        pageNo: 1,
      })
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
        if (values.time) {
          values.operatStartTime = values.time[0].format('YYYY-MM-DD HH:mm:ss')
          values.operatEndTime = values.time[1].format('YYYY-MM-DD HH:mm:ss')
        }
        delete values.time
        this.props.getStoreWater(values)
      })
    }

    handleDetails (record) {
      this.props.router.push(
        `/beinoen/stockDetails/${record.id}`
      )
    }

    render () {
      const { getFieldDecorator } = this.props.form

      const editColumns = [
        {
          title: '操作时间',
          dataIndex: 'operatTime',
          key: 'operatTime',
          align: 'center',
          width: 160,
        },
        {
          title: '商品名称',
          dataIndex: 'commodityName',
          key: 'commodityName',
          align: 'center',
          width: 160,
        },
        {
          title: '商品类型',
          dataIndex: 'commoditySrcStr',
          key: 'commoditySrcStr',
          align: 'center',
          width: 160,
        },
        {
          title: '操作员',
          dataIndex: 'operatorName',
          key: 'operatorName',
          align: 'center',
          width: 90,
        },
        {
          title: '操作类型',
          dataIndex: 'operatTypeStr',
          key: 'operatTypeStr',
          align: 'center',
          width: 90,
        },
        {
          title: '数量',
          dataIndex: 'operatStockCount',
          key: 'operatStockCount',
          align: 'center',
          width: 90,
        },
      ]

      const columns = [{
        title: '操作时间',
        dataIndex: 'operatTime',
        key: 'operatTime',
        align: 'center',
        width: 160,
      },
      {
        title: '商品名称',
        dataIndex: 'commodityName',
        key: 'commodityName',
        align: 'center',
        width: 160,
      },
      {
        title: '商品类型',
        dataIndex: 'commoditySrcStr',
        key: 'commoditySrcStr',
        align: 'center',
        width: 160,
      },
      {
        title: '操作员',
        dataIndex: 'operatorName',
        key: 'operatorName',
        align: 'center',
        width: 90,
      },
      {
        title: '操作类型',
        dataIndex: 'operatTypeStr',
        key: 'operatTypeStr',
        align: 'center',
        width: 90,
      },
      {
        title: '数量',
        dataIndex: 'operatStockCount',
        key: 'operatStockCount',
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
            onClick={() => this.handleDetails(record)}
          >
                            详情
          </a>
        ),
      },
      ]
      return (
        <div className="contaienr-box">
          <ContentBox>
            <Title title="库存流水" />
            <div className={style['search-container']}>
              <Form>
                <Row gutter={24}>
                  <Col span={9}>
                    <FormItem {...formItemLayout} label="操作员">
                      {getFieldDecorator('operatorId')(
                        <Select placeholder="请选择">
                          {this.props.clerks.map(item => (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={9}>
                    <FormItem {...formItemLayout} label="操作类型">
                      {getFieldDecorator('operatType')(
                        <Select placeholder="请选择">
                          {this.state.operTypeList.map(item => (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={9} push={0}>
                    <FormItem {...formItemLayout} label="商品名称">
                      {getFieldDecorator('commodityName')(
                        <Input placeholder="输入商品名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={9}>
                    <FormItem {...formItemLayout} label="商品类型">
                      {getFieldDecorator('commoditySrc')(
                        <Select placeholder="请选择">
                          {this.state.commodityType.map(item => (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={14} push={1}>
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
                      {getFieldDecorator('time')(<RangePicker
                        format={'YYYY-MM-DD HH:mm:ss'} />)}
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
              dataSource={this.props.storeWater}
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
  total: state.store.waterTotal || 0,
  dataSource: (state.store.stocks && state.store.stocks.list) || [],
  instockList: (state.store.details && state.store.details.instockList) || [],
  clerks: (state.system.clerks && state.system.clerks).list || [],
  storeWater: state.store.storeWater || [],
})
const mapDispatch = dispatch => ({
  getStoreWater: dispatch.store.getStoreWater,
  getGoodsStoreDetails: dispatch.store.getGoodsStoreDetails,
  getClerks: dispatch.system.getClerks,
  editBainuoen: dispatch.store.editBainuoen,
})
const water = Form.create()(waterForm)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(water)
)
