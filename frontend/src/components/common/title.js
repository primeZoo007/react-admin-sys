import React, { PureComponent } from 'react'
import { Icon } from 'antd'
import PropTypes from 'prop-types'

import style from './title.css'

export default class Title extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
  }

  render () {
    return (
      <div className={style['content-title']}>
        <Icon type="appstore" style={{ fontSize: 20 }} />
        <span>{this.props.title}</span>
      </div>
    )
  }
}
