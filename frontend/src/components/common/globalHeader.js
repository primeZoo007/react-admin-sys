import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Dropdown, Avatar, Row, Col } from 'antd'
import classnames from 'classnames'
import bridge from 'utils/bridge'

import style from './globalHeader.css'

export default class GlobalHeader extends PureComponent {
  static propTypes = {
    deleteLogout: PropTypes.func,
    title: PropTypes.string,
    router: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {
      route: [
        // {
        //   name: '快速订单',
        //   value: 'quickOrder',
        // },
        // {
        //   name: '自有商品入库',
        //   value: 'goods',
        // },
        // {
        //   name: '百诺恩商品入库',
        //   value: 'bainuoenStore',
        // },
        // {
        //   name: '提货单处理',
        //   value: 'pick',
        // },
        // {
        //   name: '服务消费',
        //   value: 'service',
        // },
      ],
    }
    this.handleLogout = this.handleLogout.bind(this)
    this.handleLogoutApp = this.handleLogoutApp.bind(this)
  }

  componentDidMount () {
    const arr = []
    const headerPower =
      JSON.parse(window.localStorage.getItem('headPower')) || []
    headerPower.forEach(item => {
      if (item === 'orderCreate') {
        arr.push({
          name: '创建订单',
          value: 'quickOrder',
        })
      }
      if (item === 'shopStore') {
        arr.push({
          name: '自有商品入库',
          value: 'goods',
        })
      }
      if (item === 'bainuoenStore') {
        arr.push({
          name: '百诺恩商品入库',
          value: 'bainuoenStore',
        })
      }
      if (item === 'pickOrder') {
        arr.push({
          name: '提货单处理',
          value: 'pick',
        })
      }
      if (item === 'serviceConsume') {
        arr.push({
          name: '服务消费',
          value: 'service',
        })
      }
    })
    this.setState({
      route: arr,
    })
  }

  handleLogout ({ key }) {
    if (key === 'logout') {
      this.props.deleteLogout()
    }
  }

  handleLogoutApp () {
    bridge.closeApp()
  }

  handleClick (value) {
    switch (value) {
      case 'quickOrder':
        this.props.router.push('/beinoen/order/add')
        break
      case 'goods':
        this.props.router.push('/beinoen/commodity/store')
        break
      case 'bainuoenStore':
        this.props.router.push('/beinoen/commodity')
        break
      case 'pick':
        this.props.router.push('/beinoen/pick/up')
        break
      case 'service':
        this.props.router.push('/beinoen/service/consumer')
        break

      default:
        break
    }
  }

  render () {
    const menu = (
      <Menu className={style['menu']}>
        <Menu.Item key="logout" onClick={this.handleLogout}>
          <Icon type="menu-unfold" />
          退出登录
        </Menu.Item>
        {/* <Menu.Item key="logoutapp" onClick={this.handleLogoutApp}>
          <Icon type="logout" />
          退出程序
        </Menu.Item> */}
      </Menu>
    )
    return (
      <div className={style['page-header']}>
        <Row gutter={24}>
          <Col span={20}>
            <div className={style['left']}>
              <div className={style['header-route']}>
                {this.state.route.map((item, index) => (
                  <div
                    onClick={() => this.handleClick(item.value)}
                    className={style['route-item']}
                    key={index}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col span={4}>
            <div className={style['right']}>
              <Dropdown overlay={menu} trigger={['click']}>
                <span className={classnames(style.action, style.account)}>
                  <Avatar
                    size="small"
                    className={style['avatar']}
                    src="//img3.dian.so/lhc/2018/09/27/66w_66h_82C691538053759.png"
                  />
                  <span className={style['name']}>
                    <span>
                      {window.localStorage.getItem('shopName')}-
                      {window.localStorage.getItem('clerkName')}
                    </span>
                  </span>
                </span>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
