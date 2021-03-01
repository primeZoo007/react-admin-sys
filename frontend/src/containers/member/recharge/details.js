import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import Title from 'components/Title'
import ContentBox from 'components/ContentBox'
import style from './details.css'
import bridge from 'utils/bridge'

class Details extends Component {
  static propTypes = {
    form: PropTypes.object,
    router: PropTypes.object,
    match: PropTypes.object,
    details: PropTypes.object,
    getDetailWater: PropTypes.func,
    instockList: PropTypes.array,
    loading: PropTypes.bool,
  }

  constructor (props) {
    super(props)
    this.state = {
      print: false,
      color: '',
      display: 'none',
      typeBlock: 'block',
    }
    this.handleReturn = this.handleReturn.bind(this)
    this.printPaper = this.printPaper.bind(this)
  }

  async componentDidMount () {
    const id = this.props.match.params.id
    let json = await this.props.getDetailWater({ recordId: id })
    // eslint-disable-next-line eqeqeq
    console.log(json)
    // eslint-disable-next-line eqeqeq
    if (json.data.tradeType == '1') {
      this.setState({
        display: 'block',
      })
      // eslint-disable-next-line eqeqeq
    } else if (json.data.tradeType == '3') {
      this.setState({
        typeBlock: 'none',
      })
    }
  }

  handleReturn () {
    this.props.router.goBack()
  }
  async printPaper () {
    this.setState({
      print: true,
      color: '#1111',
    })
    setTimeout(() => {
      this.setState({
        print: false,
        color: 'rgba(104, 129, 235, 1)',
      })
    }, 5000)
    let shopName = window.localStorage.getItem('shopName')
    const id = this.props.match.params.id
    let json = await this.props.getDetailWater({ recordId: id })
    console.log(json)
    // let walletBalance = (parseInt('1000000')/100.0).toFixed(2);
    let params = {
      balance: json.data.afterTradeBalanceStr, // 保留两位小数
      chargeAmount: json.data.tradeAmountStr, // 保留两位小数
      clerk: {
        clerkName: json.data.name,
        clerkPhone: json.data.mobile,
      },
      createTime: json.data.tradeTime,
      givenAmount: 0, // 保留两位小数
      operator: json.data.clerkName,
      payTypeStr: json.data.rechargeTypeStr,
      serialNo: json.data.recordId, // 订单流水号
      shopName: shopName,
    }
    console.log(params)
    bridge.printCharge(JSON.stringify(params))
  }

  render () {
    return (
      <div className="contaienr-box">
        <ContentBox>
          <Title title="流水详情" />
          <button className={style['add-btn']} onClick={this.printPaper} style={{ display: this.state.display, background: this.state.color }} disabled={this.state.print}>
            打印小票
          </button>
          <Row gutter={24}>
            <Col span={12}>
              <div className={style['detail-info']}>
                  交易类型：{this.props.details && this.props.details.tradeTyoeStr}
              </div>

            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <div className={style['detail-info']}>
                  交易时间：
                {this.props.details && this.props.details.tradeTime}
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <div className={style['detail-info-s']}>
                  交易金额：{this.props.details && this.props.details.tradeAmountStr}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              {/* eslint-disable-next-line standard/object-curly-even-spacing */}
              <div className={style['detail-info-s']} style={{ display: this.state.typeBlock }}>
                充值方式：
                {this.props.details && this.props.details.rechargeTypeStr}
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <div className={style['detail-info']}>
                操作员：
                {this.props.details && this.props.details.clerkName}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <div className={style['detail-info-s']}>
                  余额：
                {this.props.details && this.props.details.afterTradeBalanceStr}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <div className={style['detail-info-s']}>
                备注：
                {this.props.details && this.props.details.remark}
              </div>
            </Col>
          </Row>
          <div className={style['title-top']}>
            <Title title="会员信息" />
            <Row gutter={24}>
              <Col span={12}>
                <div className={style['detail-info-s']}>
                    姓名：{this.props.details && this.props.details.name}
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div className={style['detail-info-s']}>
                    手机：
                  {this.props.details && this.props.details.mobile}
                </div>
              </Col>
            </Row>
          </div>
          <div className={style['return-container']}>
            <button onClick={this.handleReturn}>返回</button>
          </div>
        </ContentBox>
      </div>
    )
  }
}

const mapState = state => ({
  loading: state.member.tableLoading,
  details: state.member.detailsContent,
})
const mapDispatch = dispatch => ({
  getDetailWater: dispatch.member.getDetailWater,
})

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Details)
)
