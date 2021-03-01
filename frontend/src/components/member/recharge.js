import React, { PureComponent } from 'react'
import { Form, Row, Col, Input, Modal, Select } from 'antd'
import PropTypes from 'prop-types'
import style from './recharge.css'

const { Option } = Select
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
      memberId: PropTypes.number,
      name: PropTypes.string,
      form: PropTypes.object,
      title: PropTypes.string,
      type: PropTypes.string,
      handleCancel: PropTypes.func,
      rechargeVisible: PropTypes.bool,
      editData: PropTypes.object,
    }
    constructor (props) {
      super(props)
      this.state = {}
      this.handleOk = this.handleOk.bind(this)
      this.handleCancel = this.handleCancel.bind(this)
      this.fixAmount = this.fixAmount.bind(this)
    }

    handleCancel () {
      this.props.handleCancel()
    }

     fixAmount =(e) => {
       let amount
       if (!e.target.value) {
         amount = 0.00
       } else {
         amount = parseFloat(e.target.value).toFixed(2)
       }

       this.props.form.setFieldsValue({
         rechargeAmount: amount,
       })
       // e.target.value = parseFloat(e.target.value).toFixed(2)
     }
     handleOk () {
       this.props.form.validateFields((e, values) => {
         values.rechargeAmount = values.rechargeAmount * 100
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
                visible={this.props.rechargeVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form>
                  <div className={style['search-container']}>
                    <Row gutter={24}>
                      <Col span={16}>
                        <FormItem {...formItemLayout} label="姓名">
                          {getFieldDecorator('name', {
                          })(<div>{this.props.name}</div>)}
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
                        <FormItem {...formItemLayout} label="充值金额">
                          {getFieldDecorator('rechargeAmount', {
                          })(<Input
                            value={this.state.value}
                            onBlur={this.fixAmount}
                            placeholder="输入金额" />)}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={16}>
                        <FormItem {...formItemLayout} label="支付方式">
                          {getFieldDecorator('rechargeType', {})(
                            <Select placeholder="请选择支付方式">
                              <Option value="1">支付宝</Option>
                              <Option value="2">微信</Option>
                              <Option value="3">现金</Option>
                              <Option value="0">其他</Option>
                            </Select>
                          )}
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
                    <Row gutter={24} style={{ visibility: 'hidden' }}>
                      <Col span={16}>
                        <FormItem {...formItemLayout} label="编号">
                          {getFieldDecorator('mid', {
                            initialValue: this.props.memberId,
                          })(<div>{this.props.memberId}</div>)}
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                  <div className={style['btn-container']}>
                    <button onClick={this.handleOk} className={style['ok-btn']}>
                                充值
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
