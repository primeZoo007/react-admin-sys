import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import Title from 'components/Title'
import ContentBox from 'components/ContentBox'
import style from './details.css'

class Details extends Component {
    static propTypes = {
      form: PropTypes.object,
      router: PropTypes.object,
      match: PropTypes.object,
      getWaterDetails: PropTypes.func,
      details: PropTypes.object,
      instockList: PropTypes.array,
      loading: PropTypes.bool,
    }
    constructor (props) {
      super(props)
      this.state = {}
      this.handleReturn = this.handleReturn.bind(this)
    }

    componentDidMount () {
      const id = this.props.match.params.id
      this.props.getWaterDetails({ stockWaterId: id })
    }

    handleReturn () {
      this.props.router.goBack()
    }

    render () {
      return (
        <div className="contaienr-box">
          <ContentBox>
            <Title title="详细信息" />
            <Row gutter={24}>
              <Col span={12}>
                <div className={style['detail-info']}>
                                操作时间：{this.props.details && this.props.details.operatTime}
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <div className={style['detail-info']}>
                          商品名称：
                  {this.props.details && this.props.details.commodityName}
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <div className={style['detail-info-s']}>
                                商品类型：{this.props.details && this.props.details.commoditySrcStr}
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div className={style['detail-info-s']}>
                          操作编号：
                  {this.props.details && this.props.details.commodityBarcode}
                </div>
              </Col>
            </Row>
            <div className={style['title-top']}>
              <Title title="商品信息" />
              <Row gutter={24}>
                <Col span={12}>
                  <div className={style['detail-info-s']}>
                                操作员：{this.props.details && this.props.details.operatorName}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div className={style['detail-info-s']}>
                          操作类型：
                    {this.props.details && this.props.details.operatTypeStr}
                  </div>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <div className={style['detail-info-s']}>
                                数量：{this.props.details && this.props.details.operatStockCount}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div className={style['detail-info-s']}>
                          余量：
                    {this.props.details && this.props.details.operatAfterCount}
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
  loading: state.store.tableLoading,
  details: state.store.waterDetails,
})
const mapDispatch = dispatch => ({
  getWaterDetails: dispatch.store.getWaterDetails,
})

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Details)
)
