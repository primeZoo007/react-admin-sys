import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './modal.css'

export default class ModalComponent extends PureComponent {
  static propTypes = {
    onToggleModal: PropTypes.func,
    showModal: PropTypes.any,
  }
  constructor (props) {
    super(props)
    this.state = {
      params: {},
      zIndex: 1000002,
    }
    this.handlePrevent = this.handlePrevent.bind(this)
  }
  showModal (params, zIndex = 1000002) {
    const initParams = {
      title: params.title || '',
      content: params.content || '',
      showCancel:
        typeof params.showCancel === 'undefined' ? true : params.showCancel,
      cancelText: params.cancelText || '取消',
      cancelColor: params.cancelColor || '#222222',
      confirmText: params.confirmText || '确定',
      confirmColor: params.confirmColor || '#3cc51f',
      success: () => {
        this.props.onToggleModal(false)
        params.success && params.success()
      },
      fail: () => {
        this.props.onToggleModal(false)
        params.fail && params.fail()
      },
    }
    this.setState(
      {
        params: initParams,
        zIndex: zIndex,
      },
      () => {
        this.props.onToggleModal(true)
      }
    )
  }
  handlePrevent (e) {
    e.stopPropagation()
    e.preventDefault()
  }
  componentDidMount () {
    Object.defineProperty(window, 'showModal', {
      enumerable: false,
      configurable: false,
      get: () => {
        return this.showModal.bind(this)
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
        {this.state.params && (
          <div className={style['panel']}>
            <div className={style['panel-header']}>
              {this.state.params.title}
            </div>
            <div className={style['panel-content']}>
              {this.state.params.content}
            </div>
            <div className={style['panel-footer']}>
              {this.state.params.showCancel && (
                <button
                  style={{ color: this.state.params.cancelColor }}
                  onClick={() => this.state.params.fail()}
                  className={style['panel-footer-left-button']}
                >
                  {this.state.params.cancelText}
                </button>
              )}
              <button
                style={{ color: this.state.params.confirmColor }}
                onClick={() => this.state.params.success()}
                className={style['panel-footer-right-button']}
              >
                {this.state.params.confirmText}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}
