import React, { PureComponent } from 'react'
import { Form, Row, Col, Input, Modal, Select } from 'antd'
import PropTypes from 'prop-types'
import style from './add.css'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 10 },
  },
  wrapperCol: {
    sm: { span: 14 },
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
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  handleCancel () {
    this.props.handleCancel()
  }

  handleSave () {
    this.props.form.validateFields((e, values) => {
      this.props.handleAddConfirm(values)
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
          visible={this.props.addVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <div className={style['search-container']}>
              <Row gutter={24}>
                <Col span={20}>
                  <FormItem {...formItemLayout} label="店员姓名">
                    {getFieldDecorator('name')(
                      <Input placeholder="输入店员姓名" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={20}>
                  <FormItem {...formItemLayout} label="店员手机号">
                    {getFieldDecorator('mobile')(
                      <Input placeholder="输入店员手机号" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={20}>
                  <FormItem {...formItemLayout} label="账号状态">
                    {getFieldDecorator('status')(
                      <Select
                        showSearch
                        style={{ width: 220 }}
                        placeholder="选择账号状态"
                      >
                        <Option value="0">正常</Option>
                        <Option value="1">失效</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
          </Form>
          <div className={style['btn-container']}>
            <button onClick={this.handleSave} className={style['save']}>
              保存
            </button>
            <button onClick={this.handleCancel} className={style['cancel']}>
              取消
            </button>
          </div>
        </Modal>
      </>
    )
  }
}
const Add = Form.create()(AddForm)

export default Add
