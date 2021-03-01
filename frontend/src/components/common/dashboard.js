import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Layout, Menu, Icon } from 'antd'
import style from './dashboard.css'

import CONSTANTS from 'constants'

const { Sider } = Layout
const SubMenu = Menu.SubMenu

export default class Dashboard extends PureComponent {
  static propTypes = {
    menus: PropTypes.array,
    router: PropTypes.object,
  }
  static getDerivedStateFromProps (props, state) {
    if (props.router.location.pathname !== state.current) {
      return {
        current: props.router.location.pathname,
      }
    }
    return null
  }
  constructor (props) {
    super(props)
    let openKeys = []
    let menuOptions = props.menus
    for (let i = 0; i < menuOptions.length; i++) {
      let subMenu = menuOptions[i]
      if (subMenu.child) {
        for (let j = 0; j < subMenu.child.length; j++) {
          let childMenu = subMenu.child[j]
          if (childMenu.route === props.router.location.pathname) {
            openKeys.push(`menu${i}`)
            break
          }
        }
      } else {
        if (subMenu.route === props.router.location.pathname) {
          openKeys.push(subMenu.route)
          break
        }
      }
    }
    this.state = {
      title: CONSTANTS.TITLE,
      current: props.router.location.pathname,
      openKeys: openKeys,
      collapsed: false,
    }
  }
  handleCollapse (collapsed) {
    this.setState({
      collapsed,
    })
  }
  handleClick (e) {
    if (this.props.router.location.pathname === e.key) return
    this.setState({
      current: e.key,
    })
    this.props.router.push(e.key)
  }
  handleOpenChange (openKeys) {
    const state = this.state
    let latestOpenKey
    for (let i = 0; i < openKeys.length; i++) {
      if (!(state.openKeys.indexOf(openKeys[i]) > -1)) {
        latestOpenKey = openKeys[i]
        break
      }
    }
    let latestCloseKey
    for (let i = 0; i < state.openKeys.length; i++) {
      if (!(openKeys.indexOf(state.openKeys[i]) > -1)) {
        latestCloseKey = state.openKeys[i]
        break
      }
    }
    let nextOpenKeys = []
    if (latestOpenKey) {
      nextOpenKeys = this._getAncestorKeys(latestOpenKey).concat(latestOpenKey)
    }
    if (latestCloseKey) {
      nextOpenKeys = this._getAncestorKeys(latestCloseKey)
    }
    this.setState({
      openKeys: nextOpenKeys,
    })
  }
  _getAncestorKeys () {
    return []
  }

  render () {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.handleCollapse.bind(this)}
      >
        <div className={style['dashboard-logo']}>
          <div className={style['img']} />
        </div>
        <Menu
          onClick={this.handleClick.bind(this)}
          onOpenChange={this.handleOpenChange.bind(this)}
          theme="dark"
          openKeys={this.state.openKeys}
          selectedKeys={[this.state.current]}
          mode="inline"
        >
          {this.renderMenu()}
        </Menu>
      </Sider>
    )
  }
  renderMenu () {
    return this.props.menus.map((subMenu, i) => {
      return subMenu.child ? (
        <SubMenu
          key={`menu${i}`}
          title={
            <span>
              <Icon type={subMenu.icon} />
              <span>{subMenu.name}</span>
            </span>
          }
        >
          {this.renderChildMenu(subMenu.child)}
        </SubMenu>
      ) : (
        <Menu.Item key={subMenu.route}>
          <Icon type={subMenu.icon} />
          {subMenu.name}
        </Menu.Item>
      )
    })
  }
  renderChildMenu (child) {
    return child.map(childMenu => {
      return <Menu.Item key={childMenu.route}>{childMenu.name}</Menu.Item>
    })
  }
}
