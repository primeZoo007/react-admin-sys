import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './loading.css'

export default class LoadingComponent extends PureComponent {
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
  showLoading (content = '加载中', zIndex = 1000003) {
    this.setState(
      {
        content: content,
        zIndex: zIndex,
      },
      () => {
        this.props.onToggleModal(true)
      }
    )
  }
  hideLoading () {
    this.props.onToggleModal(false)
  }
  handlePrevent (e) {
    e.stopPropagation()
    e.preventDefault()
  }
  componentDidMount () {
    Object.defineProperties(window, {
      showLoading: {
        enumerable: false,
        configurable: false,
        get: () => {
          return this.showLoading.bind(this)
        },
      },
      hideLoading: {
        enumerable: false,
        configurable: false,
        get: () => {
          return this.hideLoading.bind(this)
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
        <div className={style['panel']}>
          <img
            className={style['image']}
            src="//img3.dian.so/lhc/2018/09/27/124w_124h_F915E1538040570.gif"
          />
          <div className={style['content']}>{this.state.content}</div>
        </div>
      </div>
    )
  }
}
