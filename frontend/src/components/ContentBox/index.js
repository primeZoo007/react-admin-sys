import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import style from './index.css'

export default class ContentBox extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  }
  render () {
    return (
      <>
        <div className={style['content-contaier']}>{this.props.children}</div>
      </>
    )
  }
}
