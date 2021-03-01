import React, { PureComponent } from 'react'
import { Form, Row, Col, Input, Modal, DatePicker, Radio } from 'antd'
import PropTypes from 'prop-types'
import style from './edit.css'
import moment from 'moment'

const RadioGroup = Radio.Group
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
}

class EditForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object,
    title: PropTypes.string,
    type: PropTypes.string,
    handleCancel: PropTypes.func,
    editisible: PropTypes.bool,
    editData: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
  fixAmount =(e) => {
    let amount
    if (!e.target.value) {
      amount = 0.00
    } else {
      amount = parseFloat(e.target.value).toFixed(2)
    }
    console.log(amount)
    this.props.form.setFieldsValue({
      balance: amount,
    })
    // e.target.value = parseFloat(e.target.value).toFixed(2)
  }
  handleCancel () {
    this.props.handleCancel()
  }

  handleOk () {
    this.props.form.validateFields((e, values) => {
      values.birthday = Date.parse(values.birthday)
      values.type = this.props.editData.type
      values.id = this.props.editData.id
      values.balance = values.balance * 100
      this.props.handleOk(values)
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form

    return (
      <>
        <Modal
          destroyOnClose
          maskClosable={false}
          title={this.props.title}
          footer={null}
          visible={this.props.editVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <div className={style['search-container']}>
              <Row gutter={24}>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="手机号">
                    {getFieldDecorator('mobile', {
                      initialValue:
                        this.props.editData && this.props.editData.mobile,
                    })(<Input placeholder="输入手机号" />)}
                  </FormItem>
                </Col>
              </Row>
              {/* <Row gutter={24}>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="身份">
                    {getFieldDecorator('name1')(
                      <Select placeholder="选择身份">
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row> */}
              <Row gutter={24}>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="宝宝姓名">
                    {getFieldDecorator('name', {
                      initialValue:
                        this.props.editData && this.props.editData.name,
                    })(<Input placeholder="输入宝宝姓名" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="性别">
                    {getFieldDecorator('gender', {
                      initialValue:
                        this.props.editData && this.props.editData.gender,
                    })(
                      <RadioGroup>
                        <Radio value={0}>男</Radio>
                        <Radio value={1}>女</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="宝宝生日">
                    {getFieldDecorator('birthday', {
                      initialValue:
                        this.props.editData &&
                        moment(this.props.editData.birthday),
                    })(<DatePicker placeholder="选择日期" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="余额">
                    {getFieldDecorator('balance', {
                      initialValue:
                          this.props.editData && parseFloat(this.props.editData.balance / 100).toFixed(2),
                    })(<Input
                      value={this.state.value}
                      onBlur={this.fixAmount}
                      placeholder="输入余额" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="备注">
                    {getFieldDecorator('remark', {})(
                      <textarea className={style['text-area-container']} name="" id="" cols="30" rows="10" />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className={style['btn-container']}>
              <button onClick={this.handleOk} className={style['ok-btn']}>
                修改
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

const Edit = Form.create()(EditForm)

export default Edit
