import React, { PureComponent } from 'react'
import { Form, Input, Modal } from 'antd'
import PropTypes from 'prop-types'
import style from './dialog.css'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
}

class loginForm extends PureComponent {
    static propTypes = {
      form: PropTypes.object,
      handleCancel: PropTypes.func,
      handleConfrim: PropTypes.func,
      editVisible: PropTypes.bool,
    }
    constructor (props) {
      super(props)
      this.state = {}
      this.handleCancel = this.handleCancel.bind(this)
      this.handleConfirm = this.handleConfirm.bind(this)
    }
    validFunction = (rule, value, callback) => {
      if (!value) {
        value = ''
      }
      let reg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/g
      if (value.length < 8) {
        callback(new Error('密码必须大于等于8位'))
      } else if (!reg.test(value)) {
        callback(new Error('密码强度较弱，请重新输入密码'))
      } else {
        this.setState({
          newPass: value,
        })
        callback()
      }
    }
    confirmFunction=(rule, value, callback) => {
      if (!value) {
        value = ''
      }
      let reg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/g
      if (value.length < 8) {
        callback(new Error('密码必须大于等于8位'))
      } else if (!reg.test(value)) {
        callback(new Error('密码强度较弱，请重新输入密码'))
      } else if (this.state.newPass !== value) {
        callback(new Error('新密码与确认密码不一致'))
      } else {
        callback()
      }
    }
    handleCancel () {
      this.props.handleCancel()
    }
    handleConfirm () {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.handleConfirm(values)
        }
      })
    }

    render () {
      const { getFieldDecorator } = this.props.form
      return (
            <>
              <Modal
                maskClosable={false}
                onCancel={this.handleCancel}
                visible={this.props.editVisible}
                footer={null}
                destroyOnClose
                title="修改密码"
              >
                <Form>
                  <FormItem {...formItemLayout} label="旧密码">
                    {getFieldDecorator('oldPassword', {
                      rules: [{ required: true, message: '请输入旧密码' }],
                    })(
                      <Input placeholder="请输入旧密码" type="password" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="新密码">
                    {getFieldDecorator('newPassword', {
                      rules: [{ required: true, message: '请输入新密码' }, {
                        validator: this.validFunction,
                      }],
                    })(
                      <Input placeholder="请输入新密码" type="password" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="确认密码">
                    {getFieldDecorator('confirmPassword', {
                      rules: [{ required: true, message: '请输入确认密码' }, {
                        validator: this.confirmFunction,
                      }],
                    })(
                      <Input placeholder="请输入确认密码" type="password" />
                    )}
                  </FormItem>
                </Form>
                <div className={style['btn-container']}>
                  <button
                    className={style['ok-btn']}
                    onClick={this.handleConfirm}
                  >
                            确认
                  </button>
                  <button className={style['cancel-btn']} onClick={this.handleCancel}>
                            取消
                  </button>
                </div>
              </Modal>
            </>
      )
    }
}

const loginDialog = Form.create()(loginForm)

export default loginDialog
