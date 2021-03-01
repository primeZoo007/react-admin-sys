import React, { Component } from 'react'
import style from './ad.css'

export default class Ad extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <>
        <div className={style['ad']} />
      </>
    )
  }
}
