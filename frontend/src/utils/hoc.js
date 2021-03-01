import React from 'react'
import PropTypes from 'prop-types'

export const createContainer = function (WrappedComponent) {
  return class CreateContainer extends React.Component {
    static propTypes = {
      config: PropTypes.object,
      history: PropTypes.object,
      match: PropTypes.object,
      router: PropTypes.object,
      location: PropTypes.object,
      staticContext: PropTypes.object,
    }
    render () {
      const {
        config,
        history,
        location,
        match,
        router,
        staticContext,
      } = this.props
      return (
        <WrappedComponent
          config={config}
          history={history}
          location={location}
          match={match}
          router={router}
          staticContext={staticContext}
        />
      )
    }
  }
}
