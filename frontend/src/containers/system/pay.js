import React, { Component } from 'react'
import { Row, Col, Spin, Modal } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import Title from 'components/Title'
import ContentBox from 'components/ContentBox'
import UploadCom from 'components/common/upload'
import style from './pay.css'

class Pay extends Component {
  static propTypes = {
    tableLoading: PropTypes.boolean,
    getQrCode: PropTypes.func,
    qrCode: PropTypes.object,
    savePay: PropTypes.func,
    h5Code: PropTypes.string,
    getH5Code: PropTypes.func,
  }
  static propTypes = {}
  constructor (props) {
    super(props)
    this.state = {}
    this.handleSave = this.handleSave.bind(this)
    this.scanCode = this.scanCode.bind(this)
  }

  componentDidMount () {
    this.props.getQrCode()
  }

  handleSave () {
    this.props.savePay({
      wxQrImg:
        this.state.wechat || (this.props.qrCode && this.props.qrCode.wxQrImg),
      zfbQrImg:
        this.state.alipay || (this.props.qrCode && this.props.qrCode.zfbQrImg),
    })
  }

  handleChage (e, type) {
    if (type === 'wechat') {
      this.setState({
        wechat: e,
      })
    } else {
      this.setState({
        alipay: e,
      })
    }
  }

  scanCode () {
    this.props.getH5Code({}, () => {
      this.setState({
        addVisible: true,
      })
    })
  }

  render () {
    return (
      <div className="contaienr-box">
        <Spin spinning={this.props.tableLoading}>
          <ContentBox>
            <Title title="支付码设置" />
            <div className={style['form-container']}>
              <Row gutter={24}>
                <Col span={12}>
                  <div className={style['upload-container']}>
                    <div className={style['title']}>微信支付二维码</div>
                    <div>
                      <UploadCom
                        imageUrl={
                          this.props.qrCode && this.props.qrCode.wxQrImg
                        }
                        uploadChange={e => this.handleChage(e, 'wechat')}
                      />
                    </div>
                    <div className={style['des']}>点击上传图片</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={style['upload-container']}>
                    <div className={style['title']}>支付宝支付二维码</div>
                    <div>
                      <UploadCom
                        imageUrl={
                          this.props.qrCode && this.props.qrCode.zfbQrImg
                        }
                        uploadChange={e => this.handleChage(e, 'alipay')}
                      />
                    </div>
                    <div className={style['des']}>点击上传图片</div>
                  </div>
                </Col>
              </Row>
            </div>
            <div className={style['btn-container']}>
              <button onClick={this.handleSave}>保存</button>
              <button onClick={this.scanCode}>扫码添加</button>
            </div>
          </ContentBox>
          <Modal
            title="扫码添加支付码"
            footer={null}
            visible={this.state.addVisible}
            onCancel={() => {
              this.setState({
                addVisible: false,
              })
            }}
          >
            <div className={style['img-container']}>
              <img src={this.props.h5Code} />
            </div>
          </Modal>
        </Spin>
      </div>
    )
  }
}

const mapState = state => ({
  tableLoading: state.system.tableLoading,
  qrCode: state.system.qrCode,
  h5Code: state.system.h5Code,
})
const mapDispatch = dispatch => ({
  getQrCode: dispatch.system.getQrCode,
  savePay: dispatch.system.savePay,
  getH5Code: dispatch.system.getH5Code,
})

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Pay)
)
