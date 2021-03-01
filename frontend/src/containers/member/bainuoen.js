import React, { PureComponent } from 'react'
import { Form, Row, Col, Input, Modal, DatePicker, Radio, Select } from 'antd'
import PropTypes from 'prop-types'
import style from './bainuoen.css'

const Option = Select.Option
const RadioGroup = Radio.Group
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
}

class BainuoenForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object,
    title: PropTypes.string,
    type: PropTypes.string,
    handleCancel: PropTypes.func,
    addVisible: PropTypes.bool,
    getProvince: PropTypes.func,
    selectArea: PropTypes.func,
    selectCity: PropTypes.func,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.selectArea = this.selectArea.bind(this)
    this.selectCity = this.selectCity.bind(this)
  }

  handleCancel () {
    this.props.handleCancel()
  }

  handleOk () {
    this.props.form.validateFields((e, values) => {
      values.birthday = Date.parse(values.birthday)
      delete values.province
      delete values.city
      this.props.handleOk(values)
    })
  }

  selectArea (e) {
    this.props.form.resetFields(['city'])
    this.props.form.resetFields(['areaCode'])
    this.props.selectArea(e)
  }

  selectCity (e) {
    this.props.form.resetFields(['areaCode'])
    this.props.selectCity(e)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <>
        <Modal
          width={700}
          destroyOnClose
          maskClosable={false}
          title={this.props.title}
          footer={null}
          visible={this.props.addVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <div className={style['search-container']}>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="手机号">
                    {getFieldDecorator('mobile')(
                      <Input placeholder="输入手机号" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="会员等级">
                    {getFieldDecorator('level')(
                      <Select placeholder="请选择">
                        <Option value="2">VIP</Option>
                        <Option value="3">区域经销商</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="微信号">
                    {getFieldDecorator('wechat')(
                      <Input placeholder="输入微信号" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="身份证姓名">
                    {getFieldDecorator('realname')(
                      <Input placeholder="输入身份证姓名" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="身份证号">
                    {getFieldDecorator('idcard')(
                      <Input placeholder="输入身份证号" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="性别">
                    {getFieldDecorator('gender')(
                      <RadioGroup>
                        <Radio value={0}>男</Radio>
                        <Radio value={1}>女</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="宝宝姓名">
                    {getFieldDecorator('name')(
                      <Input placeholder="输入宝宝姓名" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="宝宝生日">
                    {getFieldDecorator('birthday')(
                      <DatePicker placeholder="选择日期" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="地址">
                    <div className={style['province-container']}>
                      <FormItem>
                        {getFieldDecorator('province')(
                          <Select
                            onChange={this.selectCity}
                            style={{ width: '150px' }}
                            placeholder="选择省份"
                          >
                            {this.props.province &&
                              this.props.province.length > 0 &&
                              this.props.province.map(item => (
                                <Option
                                  key={item.areaCode}
                                  value={item.areaCode}
                                >
                                  {item.areaName}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                      <FormItem>
                        {getFieldDecorator('city')(
                          <Select
                            style={{ width: '150px', marginLeft: '10px' }}
                            placeholder="选择城市"
                            onChange={this.selectArea}
                          >
                            {this.props.city &&
                              this.props.city.length > 0 &&
                              this.props.city.map(item => (
                                <Option
                                  key={item.areaCode}
                                  value={item.areaCode}
                                >
                                  {item.areaName}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                      <FormItem>
                        {getFieldDecorator('areaCode')(
                          <Select
                            style={{ width: '150px', marginLeft: '10px' }}
                            placeholder="选择区"
                          >
                            {this.props.area &&
                              this.props.area.length > 0 &&
                              this.props.area.map(item => (
                                <Option
                                  key={item.areaCode}
                                  value={item.areaCode}
                                >
                                  {item.areaName}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                    </div>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem {...formItemLayout} label="详细地址">
                    {getFieldDecorator('detail')(
                      <Input placeholder="输入详细地址" />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className={style['btn-container']}>
              <button onClick={this.handleOk} className={style['ok-btn']}>
                确认
              </button>
              <button
                onClick={this.handleCancel}
                className={style['cancel-btn']}
              >
                取消
              </button>
            </div>
          </Form>
        </Modal>
      </>
    )
  }
}

const Bainuoen = Form.create()(BainuoenForm)

export default Bainuoen
