import React, { PureComponent } from 'react'
import { Form, Row, Col, Input, Modal, Select } from 'antd'
import PropTypes from 'prop-types'
import style from './edit.css'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 9 },
  },
  wrapperCol: {
    sm: { span: 15 },
  },
}

class EditForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object,
    title: PropTypes.string,
    type: PropTypes.string,
    handleCancel: PropTypes.func,
    editVisible: PropTypes.bool,
    data: PropTypes.object,
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
      values.id = this.props.data.id
      this.props.handleConfirm(values)
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
          onCancel={this.handleCancel}
        >
          <Form>
            <div className={style['search-container']}>
              <Row gutter={24}>
                <Col span={20}>
                  <FormItem {...formItemLayout} label="店员姓名">
                    {getFieldDecorator('name', {
                      initialValue: this.props.data && this.props.data.name,
                    })(<Input placeholder="输入店员姓名" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={20}>
                  <FormItem {...formItemLayout} label="店员手机号">
                    {getFieldDecorator('mobile', {
                      initialValue: this.props.data && this.props.data.mobile,
                    })(<Input placeholder="输入店员手机号" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={20}>
                  <FormItem {...formItemLayout} label="账号状态">
                    {getFieldDecorator('status', {
                      initialValue:
                        this.props.data && this.props.data.status === '正常'
                          ? '0'
                          : '1',
                    })(
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
const Edit = Form.create()(EditForm)

export default Edit
