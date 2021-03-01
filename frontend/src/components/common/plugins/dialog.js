import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './dialog.css'

let DialogPanelCom

export default class DialogComponent extends PureComponent {
  static propTypes = {
    onToggleDialog: PropTypes.func,
    showModal: PropTypes.any,
  }
  constructor (props) {
    super(props)
    this.state = {
      maskClick: false,
      zIndex: 1000001,
    }
    this.handlePrevent = this.handlePrevent.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
  }
  showDialog (dialogPanelCom, maskClick = false, zIndex = 1000001) {
    DialogPanelCom = dialogPanelCom
    this.setState(
      {
        maskClick: maskClick,
        zIndex: zIndex,
      },
      () => {
        this.props.onToggleDialog(true)
      }
    )
  }
  handlePrevent (e) {
    e.stopPropagation()
    e.preventDefault()
  }
  handleCloseDialog (e) {
    this.props.onToggleDialog(false)
    e && e.stopPropagation()
    e && e.preventDefault()
  }
  componentDidMount () {
    Object.defineProperty(window, 'showDialog', {
      enumerable: false,
      configurable: false,
      get: () => {
        return this.showDialog.bind(this)
      },
    })
  }
  render () {
    return (
      <div
        onClick={e => {
          this.state.maskClick && this.handleCloseDialog(e)
          e && e.stopPropagation()
          e && e.preventDefault()
        }}
        className={classnames({
          [style.modal]: true,
          [style.show]: this.props.showModal,
          [style.hide]:
            typeof this.props.showModal === 'boolean' && !this.props.showModal,
        })}
        style={{ zIndex: this.state.zIndex }}
      >
        {this.props.showModal ? (
          <DialogPanelCom onClose={this.handleCloseDialog} />
        ) : null}
      </div>
    )
  }
}
