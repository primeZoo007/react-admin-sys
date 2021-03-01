import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Loadable from 'react-loadable'
import { Layout } from 'antd'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import CreateHistory from 'history/createBrowserHistory'
import { connect } from 'react-redux'

import { setTitle } from 'utils/bridge'
import NProgress from 'components/common/nprogress'
import CommonCom from 'components/common'
import GlobalHeader from 'components/common/globalHeader'
import Dashboard from 'components/common/dashboard'

import { routes } from '../routes'
import style from './app.css'

const { Header, Content } = Layout
const history = new CreateHistory()

const Loading = () => {
  // 当点击跳转的时候此时会先执行当前loading之后才会执行页面的componentWillMount
  NProgress.start()
  return <div />
}
const createComponent = (
  item,
  historyProps,
  router,
  deleteLogout,
  menuData
) => {
  const LoadableBar = Loadable({
    loader: async () => {
      try {
        return await import(`${item.page}`)
      } catch (error) {
        console.log(error)
      }
    },
    loading: Loading,
    render (loaded, params) {
      NProgress.done()
      setTitle(item.title)
      let Component = loaded.default
      return <Component {...params} config={item} />
    },
  })
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/beinoen/.test(historyProps.location.pathname) ? (
        <Dashboard router={router} menus={menuData} />
      ) : null}
      <Layout>
        {/beinoen/.test(historyProps.location.pathname) ? (
          <Header style={{ background: '#fff', padding: 0 }}>
            <GlobalHeader deleteLogout={deleteLogout} router={router} />
          </Header>
        ) : null}
        <Content style={{ backgroundColor: '#F6F7FA', height: '100%' }}>
          <LoadableBar {...historyProps} router={router} />
        </Content>
      </Layout>
    </Layout>
  )
}

class App extends Component {
  static propTypes = {
    deleteLogout: PropTypes.func,
  }
  constructor (props) {
    super(props)
    this.state = {
      menuData: [],
    }
  }

  componentDidMount () {
    this.filter()
  }
  filter () {
    //   let newArr = []
    //   const power = JSON.parse(window.localStorage.getItem('power'))
    //   const arr = JSON.parse(JSON.stringify(menu.admin))

    //   console.log(1111, power, arr)

    //   for (var i = 0, arrayLen = arr.length; i < arrayLen; i++) {
    //     for (var j = 0, delLen = power.length; j < delLen; j++) {
    //       console.log(power[j])
    //       if (arr[i].key === power[j]) {
    //         newArr.push(arr[i])
    //       }
    //     }
    //     // if (j === delLen) {
    //     // newArr.push(arr[i])
    //     // }
    //   }
    //   console.log('-----', newArr)

    //   newArr.map((item, index) => {
    //     item.child &&
    //       item.child.map((element, index2) => {
    //         power.forEach(ele => {
    //           if (element.key === ele) {
    //             arr[index].child && arr[index].child.splice(index2, 1)
    //           }
    //         })
    //       })
    //   })
    this.setState({
      menuData: JSON.parse(window.localStorage.getItem('power')) || [],
    })
  }
  render () {
    return (
      <>
        <CommonCom />
        <Fragment>
          <Router history={history}>
            <Switch>
              <Route
                path="/"
                className={style['ere']}
                exact
                render={() => <Redirect to="/beinoen/shop/store" />}
              />
              {routes
                .filter(item => item.path !== '/')
                .map((item, i) => {
                  return (
                    <Route
                      key={i}
                      {...item.option}
                      path={item.path}
                      component={historyProps => {
                        return createComponent(
                          item,
                          historyProps,
                          history,
                          this.props.deleteLogout,
                          this.state.menuData
                        )
                      }}
                    />
                  )
                })}
            </Switch>
          </Router>
        </Fragment>
      </>
    )
  }
}

const mapState = state => ({})

const mapDispatch = dispatch => ({
  deleteLogout: dispatch.common.deleteLogout,
})

export default connect(
  mapState,
  mapDispatch
)(App)
