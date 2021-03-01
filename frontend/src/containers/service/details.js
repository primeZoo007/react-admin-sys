import React, { Component } from 'react'
import { Form, Row, Col } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import style from './details.css'
// import moment from 'moment'

// const Option = Select.Option
// const { RangePicker } = DatePicker
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 15 },
  },
}

class DetailsFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
    editService: PropTypes.func,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentDidMount () {
    this.props.getOwnGoods({
      pageSize: 1000,
      pageNo: 1,
    })
    this.props.editDetails({
      id: this.props.match.params.id,
    })
  }

  handleOk () {
    this.props.form.validateFields((e, values) => {
      values.id = this.props.eDetails.id
      this.props.editService(values)
    })
  }

  handleCancel () {
    this.props.router.goBack()
  }

  render () {
    const { getFieldDecorator } = this.props.form

    return (
      <div className="contaienr-box">
        <ContentBox>
          <Title title="服务详情" />
          <div className={style['search-container']}>
            <Row gutter={24} style={{ marginTop: '30px' }}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="活动名称">
                    {getFieldDecorator('name', {
                      initialValue:
                        this.props.eDetails && this.props.eDetails.name,
                    })(
                      // <Input placeholder="输入活动名称" />
                      <div className={style['item']}>
                        {this.props.eDetails && this.props.eDetails.name}
                      </div>
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="创建时间">
                    {getFieldDecorator('cretime')(
                      <div className={style['item']}>
                        {this.props.eDetails && this.props.eDetails.createTime}
                      </div>
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="活动时间">
                    {getFieldDecorator('time')(
                      <div className={style['item']}>
                        {this.props.eDetails && this.props.eDetails.startTime}~
                        {this.props.eDetails && this.props.eDetails.endTime}
                      </div>
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            {/* <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="活动用户">
                    {getFieldDecorator('scope', {
                      initialValue:
                        this.props.eDetails && this.props.eDetails.scope,
                    })(
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="选择活动用户"
                      >
                        <Option value={1}>全部</Option>
                        <Option value={2}>仅会员</Option>
                      </Select>
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row> */}
            {/* <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="活动商品">
                    {getFieldDecorator('commodityId', {
                      initialValue:
                        this.props.eDetails && this.props.eDetails.commodityId,
                    })(
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="选择活动商品"
                      >
                        {this.props.goodsList.map((item, index) => {
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
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                      </Select>
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row> */}
            <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="活动数量">
                    {getFieldDecorator('count', {
                      initialValue:
                        this.props.eDetails && this.props.eDetails.count,
                    })(
                      <div className={style['item']}>
                        {this.props.eDetails && this.props.eDetails.count}
                      </div>
                      // <Input placeholder="输入活动数量" />
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            {/* <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="商品单价">
                    {getFieldDecorator('price')(
                      <div className={style['money']}>
                        {this.props.eDetails && this.props.eDetails.price}
                      </div>
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row> */}
            <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="活动价格">
                    {getFieldDecorator('price', {
                      initialValue:
                        this.props.eDetails && this.props.eDetails.price,
                    })(
                      <div className={style['item']}>
                        {this.props.eDetails && this.props.eDetails.price}
                      </div>
                      // <Input type="number" placeholder="输入活动价格" />
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form>
                  <FormItem {...formItemLayout} label="服务备注">
                    {getFieldDecorator('mark', {
                      initialValue:
                        this.props.eDetails && this.props.eDetails.mark,
                    })(
                      <div className={style['item']}>
                        {this.props.eDetails && this.props.eDetails.mark}
                      </div>
                      // <Input placeholder="输入服务备注" />
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </div>
          <div className={style['btn-container']}>
            {/* <button onClick={this.handleOk} className={style['ok-btn']}>
              修改
            </button> */}
            <button onClick={this.handleCancel} className={style['ok-btn']}>
              返回
            </button>
          </div>
        </ContentBox>
      </div>
    )
  }
}

const mapState = state => ({
  eDetails: state.service.eDetails,
  goodsList: (state.shop.ownGoods && state.shop.ownGoods.list) || [],
})
const mapDispatch = dispatch => ({
  editService: dispatch.service.editService,
  editDetails: dispatch.service.editDetails,
  getOwnGoods: dispatch.shop.getOwnGoods,
})
const Details = Form.create()(DetailsFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Details)
)
