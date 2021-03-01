import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './toast.css'

export default class ToastComponent extends PureComponent {
  static propTypes = {
    onToggleModal: PropTypes.func,
    showModal: PropTypes.any,
  }
  constructor (props) {
    super(props)
    this.state = {
      content: '',
      zIndex: 1000003,
    }
    this.handlePrevent = this.handlePrevent.bind(this)
  }
  showToast (content = '', sec = 2000, zIndex = 1000003) {
    this.setState(
      {
        content: content,
        zIndex: zIndex,
      },
      () => {
        this.props.onToggleModal(true)
        this.__timer && clearTimeout(this.__timer)
        this.__timer = setTimeout(() => {
          this.props.onToggleModal(false)
        }, sec)
      }
    )
  }
  showError (error) {
    this.showToast(error.msg)
  }
  handlePrevent (e) {
    e.stopPropagation()
    e.preventDefault()
  }
  componentDidMount () {
    Object.defineProperties(window, {
      showToast: {
        enumerable: false,
        configurable: false,
        get: () => {
          return this.showToast.bind(this)
        },
      },
      showError: {
        enumerable: false,
        configurable: false,
        get: () => {
          return this.showError.bind(this)
        },
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
        <div className={style['content']}>{this.state.content}</div>
      </div>
    )
  }
}
