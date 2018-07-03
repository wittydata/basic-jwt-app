import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import { authService, permissionService } from '../../services'
import { permissionsFetched } from '../../states/actions/permission'
import { localStorage, sessionStorage } from '../../util'
import { routes } from '../../routes'

// UI
import Layout from 'antd/lib/layout'
import Menu from 'antd/lib/menu'
import 'antd/lib/layout/style/css'
import 'antd/lib/menu/style/css'
import './styles.css'

const { Content, Header } = Layout

class App extends Component {
  constructor (props) {
    super(props)
    const user = authService.getCurrentUser()
    this.state = {
      user
    }
  }

  componentDidMount () {
    this.fetchPermissions()
  }

  render () {
    const { location } = window
    const { pathname } = location

    return (
      <Router>
        <Layout className='wd-app'>
          <Header className='header'>
            <Menu
              className='menu'
              mode='horizontal'
              defaultSelectedKeys={[pathname]}
              theme='dark'
            >
              {routes.map((route) => {
                const { actions, name, path } = route
                const showMenu = !actions || this.canPerform(actions)

                return showMenu ? (
                  <Menu.Item key={path}><Link to={path}>{name}</Link></Menu.Item>
                ) : null
              })}

              <Menu.Item key='4' onClick={this.handleSignOut}>Logout</Menu.Item>
            </Menu>
          </Header>

          <Content className='content'>
            <div className='container'>
              {routes.map((route) => {
                const { component, exact, path } = route
                return (
                  <Route
                    key={path}
                    component={component}
                    path={path}
                    exact={exact}
                  />
                )
              })}
            </div>
          </Content>
        </Layout>
      </Router>
    )
  }

  handleSignOut = async () => {
    const response = await authService.signOut()

    if (response) {
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/login'
    }
  }

  async fetchPermissions () {
    const { permissions, permissionsFetched } = this.props

    if (permissions.length < 1) {
      const response = await permissionService.list()
      permissionsFetched(response)
      localStorage.setObject('permissions', response)
    }
  }

  canPerform (actions, any) {
    const { permissions } = this.props
    return permissionService.canPerform(actions, permissions, any)
  }
}

const mapDispatchToProps = {
  permissionsFetched
}

const mapStateToProps = (state) => {
  const { Permission } = state
  return { ...Permission }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
