import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './pageError.css'

export default class PageErrorComponent extends PureComponent {
  static propTypes = {
    onShowPageError: PropTypes.func,
    showModal: PropTypes.any,
  }
  constructor (props) {
    super(props)
    this.state = {
      error: {},
      zIndex: 1000005,
    }
    this.handlePrevent = this.handlePrevent.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }
  showPageError (error = {}, zIndex = 1000005) {
    this.setState(
      {
        error: error,
        zIndex: zIndex,
      },
      () => {
        this.props.onShowPageError()
      }
    )
  }
  handlePrevent (e) {
    e.stopPropagation()
    e.preventDefault()
  }
  handleRefresh () {
    window.location.reload()
  }
  componentDidMount () {
    Object.defineProperty(window, 'showPageError', {
      enumerable: false,
      configurable: false,
      get: () => {
        return this.showPageError.bind(this)
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
          <div className="title">
            <p>{this.state.error && this.state.code}</p>
            <p>服务器开小差了～</p>
          </div>
          <div className={style['refresh']} onClick={this.handleRefresh}>
            刷新
          </div>
        </div>
      </div>
    )
  }
}
