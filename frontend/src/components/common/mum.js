import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import style from './mum.css'

export default class MumComponent extends PureComponent {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
  }
  render () {
    return (
      <>
        <div className={style['mum']}>
          <img
            src="//lhc-image.oss-cn-beijing.aliyuncs.com/lhc/2017/06/30/124w_124h_63CAA1498816035.gif"
            style={{
              width: this.props.width,
              height: this.props.height,
            }}
          />
        </div>
      </>
    )
  }
}
