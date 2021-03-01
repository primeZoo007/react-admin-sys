import React, { Component } from 'react'
import { Form, Row, Col, Input, DatePicker, message } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import style from './new.css'

// const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 15 },
  },
}

class NewFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
    addServiceRequest: PropTypes.string,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentDidMount () {
    this.props.getOwnGoods({
      type: 1,
      pageSize: 1000,
      pageNo: 1,
    })
  }

  // 新增服务
  handleOk () {
    if (!this.submiting) {
      this.submiting = true
      this.props.form.validateFields((e, values) => {
        if (values.time) {
          values.startTime = Date.parse(values.time[0])
          values.endTime = Date.parse(values.time[1])
        }
        delete values.time
        this.props.addService(values, res => {
          if (res.success) {
            message.success('创建成功', 4)
            this.props.router.push('/beinoen/service/list')
            this.submiting = false
          } else {
            this.submiting = false
          }
        })
      })
    }
  }

  handleCancel () {
    this.props.router.goBack()
  }

  render () {
    const { getFieldDecorator } = this.props.form

    return (
      <div className="contaienr-box">
        <ContentBox>
          <Title title="新建服务" />
          <div className={style['search-container']}>
            <Row gutter={24} style={{ marginTop: '30px' }}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="服务名称">
                    {getFieldDecorator('name')(
                      <Input placeholder="输入服务名称" />
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="服务时间">
                    {getFieldDecorator('time')(<RangePicker />)}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            {/* <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="服务用户">
                    {getFieldDecorator('scope')(
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="选择服务用户"
                      >
                        <Option value="1">全部</Option>
                        <Option value="2">仅会员</Option>
                      </Select>
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row> */}
            {/* <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="服务商品">
                    {getFieldDecorator('commodityId')(
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="选择服务商品"
                      >
                        {this.props.googList.map((item, index) => {
                          return (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row> */}
            {/* <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="商品名称">
                    {getFieldDecorator('name')(
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="选择商品名称"
                      >
                        {this.props.googList.map((item, idnex) => {
                          return <Option value={item.id}>{item.name}</Option>
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row> */}
            <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="服务数量">
                    {getFieldDecorator('count')(
                      <Input type="number" placeholder="输入服务数量" />
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="服务价格">
                    {getFieldDecorator('price')(
                      <Input placeholder="输入服务价格" />
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="服务备注">
                    {getFieldDecorator('mark')(
                      <Input placeholder="输入服务备注" />
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </div>
          <div className={style['btn-container']}>
            <button onClick={this.handleOk} className={style['ok-btn']}>
              创建
            </button>
            <button onClick={this.handleCancel} className={style['cancel-btn']}>
              取消
            </button>
          </div>
        </ContentBox>
      </div>
    )
  }
}

const mapState = state => ({
  googList: (state.shop.ownGoods && state.shop.ownGoods.list) || [],
  addServiceRequest: state.service.addServiceRequest,
})
const mapDispatch = dispatch => ({
  addService: dispatch.service.addService,
  getOwnGoods: dispatch.shop.getOwnGoods,
})
const New = Form.create()(NewFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(New)
)
