import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import style from './index.css'

export default class Title extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.element,
  }
  render () {
    return (
      <>
        <div className={style['title-container']}>
          {this.props.children ? (
            this.props.children
          ) : (
            <div className={style['title']}>{this.props.title}</div>
          )}
        </div>
      </>
    )
  }
}
