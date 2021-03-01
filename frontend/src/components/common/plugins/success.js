import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './success.css'

export default class SuccessComponent extends PureComponent {
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
  showSuccess (content = '已完成', sec = 2000, zIndex = 1000003) {
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
  handlePrevent (e) {
    e.stopPropagation()
    e.preventDefault()
  }
  componentDidMount () {
    Object.defineProperty(window, 'showSuccess', {
      enumerable: false,
      configurable: false,
      get: () => {
        return this.showSuccess.bind(this)
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
        <div className={style['panel']}>
          <img
            className={style['image']}
            src="//img3.dian.so/lhc/2018/09/27/198w_142h_9AE371538040592.png"
          />
          <div className={style['content']}>{this.state.content}</div>
        </div>
      </div>
    )
  }
}
