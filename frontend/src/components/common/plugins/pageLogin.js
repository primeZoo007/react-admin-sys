import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { setTitle } from 'utils/bridge'

import style from './pageLogin.css'

export default class PageLoginComponent extends PureComponent {
  static propTypes = {
    onShowPageLogin: PropTypes.func,
    showModal: PropTypes.any,
  }
  constructor (props) {
    super(props)
    this.state = {
      zIndex: 1000005,
    }
    this.handlePrevent = this.handlePrevent.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }
  showPageLogin (zIndex = 1000005) {
    this.setState(
      {
        zIndex: zIndex,
      },
      () => {
        setTitle('请登录')
        this.props.onShowPageLogin()
      }
    )
  }
  handlePrevent (e) {
    e.stopPropagation()
    e.preventDefault()
  }
  handleLogin () {
    window.location.reload()
  }
  componentDidMount () {
    Object.defineProperty(window, 'showPageLogin', {
      enumerable: false,
      configurable: false,
      get: () => {
        return this.showPageLogin.bind(this)
      },
    })
  }
  render () {
    return (
      <div
        onClick={this.handlePrevent}
        className={classnames({
          [style.modal]: true,
          [style.show]: this.props.showModal,
          [style.hide]:
            typeof this.props.showModal === 'boolean' && !this.props.showModal,
        })}
        style={{ zIndex: this.state.zIndex }}
      >
        <div className={style['content']}>
          <div className={style['refresh']} onClick={this.handleLogin}>
            登录
          </div>
        </div>
      </div>
    )
  }
}
