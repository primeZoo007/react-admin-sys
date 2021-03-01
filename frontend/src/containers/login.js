import React, { Component } from 'react'
import { Input, Form, Icon, Modal, message, Button } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import LoginDialog from './login/dialog'

import style from './login.css'

const FormItem = Form.Item
class IndexFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
    login: PropTypes.func,
    changePass: PropTypes.func,
    addVisible: PropTypes.bool,
    title: PropTypes.string,
    firstMouned: PropTypes.func,
  };
  constructor (props) {
    super(props)
    this.state = {}
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.refrechCode = this.refrechCode.bind(this)
    this.firstlogin = this.firstlogin.bind(this)
  }
  componentDidMount () {
    this.setState({
      display: 'none',
    })
  }

  firstlogin () {
    this.props.form.validateFields(async (e, values) => {
      let params = {
        id: values.id,
      }
      let json = await this.props.firstMouned(params)
      if (json.success) {
        if (json.data === 3) {
          this.setState({
            display: 'inline-block',
            verifycode: '/mars/captcha.jpg?' + Math.random(),
          })
        }
      } else {
        this.setState({
          display: 'none',
        })
      }
    })
  }
  handleOk=() => {
    this.setState({
      dialogVisible: false,
      editVisible: true,
    })
  }
  refrechCode () {
    this.setState({
      verifycode: '/mars/captcha.jpg?' + Math.random(),
    })
  }
  // 登录
  handleSubmit () {
    // this.setState({ editVisible: true })
    const { validateFields } = this.props.form
    validateFields(async (err, values) => {
      if (!err) {
        values.id = parseInt(values.id)
        let json = await this.props.login(values)
        if (!json.success) {
          if (json.data === 3 || json.code === '103') {
            this.setState({
              display: 'inline-block',
            })
          }
          this.setState({
            verifycode: '/mars/captcha.jpg?' + Math.random(),
          })
        } else if (json.success && json.data.weakPasswordFlag) {
          this.setState({
            dialogVisible: true,
          })
        }
      }
    })
  }
  closeDialog=() => {
    this.setState({
      editVisible: true,
    })
  }
  handleCancel () {
    this.setState({
      visible: false,
      editVisible: false,
    })
  }
   handleConfirm=async (e) => {
     let json = await this.props.changePass(e)
     if (json) {
       this.setState({
         visible: false,
         editVisible: false,
       })
       message.success('修改密码成功', 4)
     }
   }
   render () {
     const { getFieldDecorator } = this.props.form
     return (
       <div className={style['login']}>
         <div className={style['login-form']}>
           <div className={style['title-container']}>
             <div className={style['title']} />
           </div>
           <Form>
             <FormItem style={{ marginBottom: '30px' }}>
               {getFieldDecorator('id', {
                 rules: [{ required: true, message: '请输入手机号' }],
               })(
                 <Input
                   prefix={<Icon type="user" />}
                   className={style['login-input']}
                   type="number"
                   placeholder="请输入手机号"
                   onBlur={this.firstlogin}
                 />
               )}
             </FormItem>
             <FormItem style={{ marginBottom: '30px' }}>
               {getFieldDecorator('password', {
                 rules: [{ required: true, message: '请输入正确的密码' }],
               })(
                 <Input
                   prefix={<Icon type="lock" />}
                   className={style['login-input']}
                   type="password"
                   placeholder="请输入密码"
                 />
               )}
             </FormItem>
             <div className={style['input-block']} style={{ display: this.state.display }}>
               <FormItem style={{ marginBottom: '30px' }}>
                 {getFieldDecorator('verifyCode')(
                   <Input
                     prefix={<Icon type="lock" />}
                     className={style['vericode-input']}
                     maxLength={6}
                     type="text"
                     placeholder="请输入验证码"
                   />

                 )}
                 <img className={style['vericode-img']}
                   src={this.state.verifycode} alt="" onClick={this.refrechCode} />
               </FormItem>

             </div>
             <div className={style['btn-container']}>
               <button className={style['login-btn']}
                 onClick={this.handleSubmit}>
                登录
               </button>
             </div>
           </Form>
         </div>
         <LoginDialog
           editVisible={this.state.editVisible}
           handleCancel={this.handleCancel}
           handleConfirm={this.handleConfirm}
         />
         <Modal
           title={'温馨提示！！！'}
           afterClose={this.closeDialog}
           visible={this.state.dialogVisible}
           okType={'primary'}
           onOk={this.ok}
           cancelButtonProps={{ show: 'false' }}
           footer={[<Button key="submit" type="primary" onClick={this.handleOk}>
           确定
           </Button>]}
         >
           <p>当前密码为弱密码，请修改密码</p>
         </Modal>
       </div>
     )
   }
}

const mapState = state => ({})
const mapDispatch = dispatch => ({
  login: dispatch.common.createLogin,
  changePass: dispatch.common.changePass,
  firstMouned: dispatch.common.firstMouned,
})
const Index = Form.create()(IndexFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Index)
)
