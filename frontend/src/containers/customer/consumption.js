import React, { Component } from 'react'
import { Table, Spin } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import style from './consumption.css'

class Consumption extends Component {
  static propTypes = {
    form: PropTypes.object,
    router: PropTypes.object,
    getList: PropTypes.func,
    match: PropTypes.object,
    getChildService: PropTypes.func,
    childService: PropTypes.array,
    conList: PropTypes.array,
    loading: PropTypes.bool,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.itemRender = this.itemRender.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
  }

  itemRender (current, type, originalElement) {
    if (type === 'prev') {
      return <a>上一页</a>
    }
    if (type === 'next') {
      return <a>下一页</a>
    }
    return originalElement
  }

  componentDidMount () {
    const { id } = this.props.match.params
    this.props.getList({
      orderId: id,
    })
    this.props.getChildService({
      orderId: id,
    })
  }

  handleAdd () {
    this.props.router.push('/beinoen/service/new')
  }

  handleEdit () {
    this.props.router.push('/beinoen/service/details')
  }

  render () {
    const columns = [
      // {
      //   title: '商品名称',
      //   dataIndex: 'name',
      //   key: 'name',
      // },
      // {
      //   title: '用户信息',
      //   dataIndex: 'commodityName',
      //   key: 'commodityName',
      // },
      // {
      //   title: '活动次数',
      //   dataIndex: 'rules',
      //   key: 'rules',
      // },
      // {
      //   title: '剩余次数',
      //   dataIndex: 'price',
      //   key: 'price',
      // },
      {
        title: '消费时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
      },
      {
        title: '操作人员',
        dataIndex: 'operator',
        key: 'operator',
        align: 'center',
      },
    ]
    return (
      <div className="contaienr-box">
        <Spin spinning={this.props.loading}>
          <ContentBox>
            <div className={style['top-container']}>
              <div className={style['count-container']}>
                服务总次数
                <span className={style['count']}>
                  {this.props.childService[0] &&
                    this.props.childService[0].totalCount}
                </span>
                次，剩余
                <span className={style['count']}>
                  {this.props.childService[0] &&
                    this.props.childService[0].remainCount}
                </span>
                次
              </div>
              {/* <div className={style['order-container']}>
              <div>订单类型：服务订单</div>
              <div>订单名称：宝宝消费</div>
            </div> */}
            </div>
            <Table
              rowKey={(record, index) => index}
              dataSource={this.props.conList}
              columns={columns}
              pagination={false}
            />
          </ContentBox>
        </Spin>
      </div>
    )
  }
}

const mapState = state => ({
  loading: state.service.tableLoading,
  conList: (state.service.conList && state.service.conList.list) || [],
  // childService: [],
  childService:
    (state.service.childService &&
      state.service.childService.length > 0 &&
      state.service.childService) ||
    [],
})
const mapDispatch = dispatch => ({
  getChildService: dispatch.service.getChildService,
  getList: dispatch.service.getList,
})

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Consumption)
)
