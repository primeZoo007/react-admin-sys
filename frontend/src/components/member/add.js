import React, { PureComponent } from 'react'
import { Form, Row, Col, Input, Modal, DatePicker, Radio } from 'antd'
import PropTypes from 'prop-types'
import style from './add.css'

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

class AddForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object,
    title: PropTypes.string,
    type: PropTypes.string,
    handleCancel: PropTypes.func,
    addVisible: PropTypes.bool,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleCancel () {
    this.props.handleCancel()
  }

  handleOk () {
    this.props.form.validateFields((e, values) => {
      values.birthday = Date.parse(values.birthday)
      this.props.handleOk(values)
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <>
        <Modal
          maskClosable={false}
          destroyOnClose
          title={this.props.title}
          footer={null}
          visible={this.props.addVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <div className={style['search-container']}>
              <Row gutter={24}>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="手机号">
                    {getFieldDecorator('mobile')(
                      <Input placeholder="输入手机号" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="宝宝姓名">
                    {getFieldDecorator('name')(
                      <Input placeholder="输入宝宝姓名" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={16}>
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
                <Col span={16}>
                  <FormItem {...formItemLayout} label="宝宝生日">
                    {getFieldDecorator('birthday')(
                      <DatePicker placeholder="选择日期" />
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
const Add = Form.create()(AddForm)

export default Add
