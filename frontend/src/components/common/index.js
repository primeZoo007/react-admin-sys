import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import DialogCom from 'components/common/plugins/dialog'
import LoadingCom from 'components/common/plugins/loading'
import ModalCom from 'components/common/plugins/modal'
import SuccessCom from 'components/common/plugins/success'
import ToastCom from 'components/common/plugins/toast'
import PageErrorCom from 'components/common/plugins/pageError'
import PageLoginCom from 'components/common/plugins/pageLogin'

export default class CommonComponent extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      showToast: null,
      showLoading: null,
      showSuccess: null,
      showModal: null,
      showDialog: null,
      showPageError: null,
      showPageLogin: null,
    }
    this.handleToggleDialog = this.handleToggleDialog.bind(this)
    this.handleToggleModal = this.handleToggleModal.bind(this)
    this.handleToggleToast = this.handleToggleToast.bind(this)
    this.handleToggleLoading = this.handleToggleLoading.bind(this)
    this.handleToggleSuccess = this.handleToggleSuccess.bind(this)
    this.handleShowPageError = this.handleShowPageError.bind(this)
    this.handleShowPageLogin = this.handleShowPageLogin.bind(this)
  }
  handleToggleToast (bool) {
    if (bool) {
      this.setState({
        showToast: true,
        showLoading: null,
        showSuccess: null,
      })
    } else {
      this.setState({
        showToast: false,
      })
    }
  }
  handleToggleLoading (bool) {
    if (bool) {
      this.setState({
        showLoading: true,
        showToast: null,
        showSuccess: null,
      })
    } else {
      this.setState({
        showLoading: false,
      })
    }
  }
  handleToggleSuccess (bool) {
    if (bool) {
      this.setState({
        showSuccess: true,
        showLoading: null,
        showToast: null,
      })
    } else {
      this.setState({
        showSuccess: false,
      })
    }
  }
  handleToggleModal (bool) {
    this.setState({
      showModal: bool,
    })
  }
  handleToggleDialog (bool) {
    this.setState({
      showDialog: bool,
    })
  }
  handleShowPageError () {
    this.setState({
      showPageError: true,
    })
  }
  handleShowPageLogin () {
    this.setState({
      showPageLogin: true,
    })
  }
  render () {
    return ReactDOM.createPortal(
      <>
        {/* z-index: 1000001; */}
        <DialogCom
          showModal={this.state.showDialog}
          onToggleDialog={this.handleToggleDialog}
        />
        {/* z-index: 1000002; */}
        <ModalCom
          showModal={this.state.showModal}
          onToggleModal={this.handleToggleModal}
        />
        {/* z-index: 1000003; */}
        <LoadingCom
          showModal={this.state.showLoading}
          onToggleModal={this.handleToggleLoading}
        />
        {/* z-index: 1000003; */}
        <SuccessCom
          showModal={this.state.showSuccess}
          onToggleModal={this.handleToggleSuccess}
        />
        {/* z-index: 1000003; */}
        <ToastCom
          showModal={this.state.showToast}
          onToggleModal={this.handleToggleToast}
        />
        {/* z-index: 1000004; */}
        <PageLoginCom
          showModal={this.state.showPageLogin}
          onShowPageLogin={this.handleShowPageLogin}
        />
        {/* z-index: 1000005; */}
        <PageErrorCom
          showModal={this.state.showPageError}
          onShowPageError={this.handleShowPageError}
        />
      </>,
      document.getElementById('common')
    )
  }
}
