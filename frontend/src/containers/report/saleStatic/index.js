import React, { Component } from 'react'
import { Form, Row, Col, Input, Table, Select, DatePicker } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
// import Title from 'components/Title'
import moment from 'moment'
import style from './index.css'
const FormItem = Form.Item
const { RangePicker } = DatePicker
const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 15 },
  },
}
const { Option } = Select
const PAGE_SIZE = 6
class ReChange extends Component {
    static propTypes = {
      form: PropTypes.object,
      tableLoading: PropTypes.bool,
    };
    constructor (props) {
      super(props)
      this.state = {
        pageNo: 1,
      }
      this.queryList = this.queryList.bind(this)
    }
    componentDidMount () {
      this.props.querySaleList({
        pageSize: 6,
        pageNo: 1,
      })
      this.props.getClerks({
        pageSize: 1000,
        pageNo: 1,
      })
    }
    pageChange =(pageNo) => {
      this.props.form.validateFields((e, values) => {
        if (values.time !== undefined && values.time.length !== 0) {
          this.props.querySaleList({
            pageNo,
            pageSize: 6,
            guiderId: values.clerk || '',
            transactionBeginTime: values.time[0].format('YYYY-MM-DD HH:mm:ss') || '',
            transactionEndTime: values.time[1].format('YYYY-MM-DD HH:mm:ss') || '',
            commodityName: values.commodityName || '',
          })
        } else {
          this.props.querySaleList({
            pageNo,
            pageSize: 6,
            guiderId: values.clerk || '',
            transactionBeginTime: '',
            transactionEndTime: '',
            commodityName: values.commodityName || '',
          })
        }
      })
    }
    queryList = () => {
      this.props.form.validateFields((e, values) => {
        if (!e) {
          if (values.time !== undefined && values.time.length !== 0) {
            this.props.querySaleList({
              pageSize: 6,
              pageNo: 1,
              guiderId: values.clerk || '',
              transactionBeginTime: values.time[0].format('YYYY-MM-DD HH:mm:ss') || '',
              transactionEndTime: values.time[1].format('YYYY-MM-DD HH:mm:ss') || '',
              commodityName: values.commodityName || '',
            })
          } else {
            this.props.querySaleList({
              pageSize: 6,
              pageNo: 1,
              guiderId: values.clerk || '',
              transactionBeginTime: '',
              transactionEndTime: '',
              commodityName: values.commodityName || '',
            })
          }
        }
      })
    }
    render () {
      const { getFieldDecorator } = this.props.form

      const columns = [
        {
          title: '商品名称',
          dataIndex: 'commodityName',
          key: 'commodityName',
          align: 'center',
          width: 100,
        },
        {
          title: '导购员',
          dataIndex: 'guiderName',
          key: 'guiderName',
          align: 'center',
          width: 120,
        },
        {
          title: '成本单价(元)',
          dataIndex: 'commodityCostUnit',
          key: 'commodityPriceUnit',
          align: 'center',
          width: 100,
        },
        { title: '销售时间',
          dataIndex: 'commondityTranTime',
          key: 'commondityTranTime',
          align: 'center',
          width: 100,
        },
        {
          title: '数量',
          dataIndex: 'commoditySalesVolumes',
          key: 'commoditySalesVolumes',
          align: 'center',
          width: 80,
        },
        {
          title: '销售额（元）',
          dataIndex: 'commodityPriceAmount',
          key: 'commodityPriceAmount',
          align: 'center',
          width: 80,
        },
        {
          title: '利润(仅供参考)',
          dataIndex: 'commondityProfit',
          key: 'commondityProfit',
          align: 'center',
          width: 100,
        },
      ]
      return (
        <div className="contaienr-box">
          <ContentBox>
            <div className={style['search-container']}>
              <Form>
                <Row gutter={24}>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="商品名称">
                      {getFieldDecorator('commodityName')(
                        <Input placeholder="输入商品名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="导购员">
                      {getFieldDecorator('clerk')(
                        <Select placeholder="请选择"
                          allowClear>
                          {this.props.clerks.map(item => (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="销售时间">
                      {getFieldDecorator('time')(<RangePicker
                        className={style['datePicker']}
                        format={'YYYY-MM-DD HH:mm:ss'}
                        ranges={{
                          '今天': [moment(new Date(new Date(new Date().toLocaleDateString()).getTime())), moment()],
                          '本周': [moment().subtract(7, 'days'), moment().subtract(0, 'days')],
                          '近一个月': [moment().subtract(30, 'days'), moment().subtract(0, 'days')],
                        }}
                        showTime
                      />)}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <Row gutter={24}>
                <Col span={12} />
                <Col span={6} push={9}>
                  <button onClick={this.queryList} className={style['select']}>
                                    筛选
                  </button>
                </Col>
              </Row>
            </div>
          </ContentBox>
          <ContentBox>
            <div className={style['amount']}>
              <span style={{ marginRight: 20 }}>销售额总额:{this.props.commodityAmount}</span>
              <span>利润总额:{this.props.profitAmount}</span>
            </div>
            <Table
              loading={this.props.tableLoading}
              rowKey={(record, index) => index}
              dataSource={this.props.dataSource}
              columns={columns}
              pagination={{
                total: this.props.total,
                pageSize: PAGE_SIZE,
                onChange: this.pageChange,
              }}
            />
          </ContentBox>
        </div>
      )
    }
}
const mapState = state => ({
  clerks: (state.system.clerks && state.system.clerks).list || [],
  tableLoading: state.report.tableLoading,
  dataSource: state.report.dataSource,
  total: state.report.total,
  commodityAmount: state.report.commodityAmount,
  profitAmount: state.report.profitAmount,
})
const mapDispatch = dispatch => ({
  querySaleList: dispatch.report.querySaleList,
  getClerks: dispatch.system.getClerks,
})
const reChangeForm = Form.create()(ReChange)
export default createContainer(connect(
  mapState,
  mapDispatch
)(reChangeForm))
