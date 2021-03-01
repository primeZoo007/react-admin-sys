import React, { Component } from 'react'
import { Row, Col, Form, Input, message } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import Title from 'components/Title'
import ContentBox from 'components/ContentBox'
import style from './password.css'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 9 },
  },
  wrapperCol: {
    sm: { span: 10 },
  },
}

class PasswordForm extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.handleSave = this.handleSave.bind(this)
  }

  handleSave () {
    this.props.form.validateFields((e, values) => {
      if (!e) {
        if (values.newPassword === values.confirmPassword) {
          this.props.editPassword(values)
        } else {
          message.error('请确认密码', 4)
        }
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="contaienr-box">
        <ContentBox>
          <Title title="修改密码" />
          <div className={style['form-container']}>
            <Form>
              <Row>
                <Col>
                  <FormItem {...formItemLayout} label="原密码">
                    {getFieldDecorator('oldPassword', {
                      rules: [
                        {
                          required: true,
                          message: '请输入原始密码',
                        },
                      ],
                    })(<Input placeholder="输入原密码" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem {...formItemLayout} label="新密码">
                    {getFieldDecorator('newPassword', {
                      rules: [
                        {
                          required: true,
                          message: '请输入新密码',
                        },
                      ],
                    })(<Input placeholder="输入新密码" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem {...formItemLayout} label="确认密码">
                    {getFieldDecorator('confirmPassword', {
                      rules: [
                        {
                          required: true,
                          message: '请输入确认密码',
                        },
                      ],
                    })(<Input placeholder="输入确认密码" />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={style['btn-container']}>
            <button onClick={this.handleSave}>保存</button>
          </div>
        </ContentBox>
      </div>
    )
  }
}

const mapState = state => ({})
const mapDispatch = dispatch => ({
  editPassword: dispatch.system.editPassword,
})

const Password = Form.create()(PasswordForm)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Password)
)
