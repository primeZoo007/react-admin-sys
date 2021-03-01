import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { createContainer } from 'utils/hoc'

class Dashboard extends Component {
  // static propTypes = {
  //   router: PropTypes.object,
  // }
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <>
        <div />
      </>
    )
  }
}

const mapState = state => ({})

const mapDispatch = dispatch => ({})

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Dashboard)
)
