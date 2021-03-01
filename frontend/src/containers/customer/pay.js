import React, { Component } from 'react'
import { Row, Col, Spin } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import Title from 'components/Title'
import ContentBox from 'components/ContentBox'
import style from './pay.css'

class Pay extends Component {
  static propTypes = {
    tableLoading: PropTypes.boolean,
    getQrCode: PropTypes.func,
    qrCode: PropTypes.object,
    savePay: PropTypes.func,
  }
  static propTypes = {}
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.props.getQrCode()
  }

  render () {
    return (
      <div className="contaienr-box">
        <Spin spinning={this.props.tableLoading}>
          <ContentBox>
            <Title title="支付码" />
            <div className={style['form-container']}>
              <Row gutter={24}>
                <Col span={12}>
                  <div className={style['upload-container']}>
                    <div className={style['title']}>微信支付二维码</div>
                    <div>
                      <img
                        className={style['qr-code']}
                        src={this.props.qrCode && this.props.qrCode.wxQrImg}
                      />
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={style['upload-container']}>
                    <div className={style['title']}>支付宝支付二维码</div>
                    <div>
                      <img
                        className={style['qr-code']}
                        src={this.props.qrCode && this.props.qrCode.zfbQrImg}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </ContentBox>
        </Spin>
      </div>
    )
  }
}

const mapState = state => ({
  tableLoading: state.system.tableLoading,
  qrCode: state.system.qrCode,
})
const mapDispatch = dispatch => ({
  getQrCode: dispatch.system.getQrCode,
})

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Pay)
)
