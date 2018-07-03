import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import App from './containers/App'
import ForgotPassword from './containers/ForgotPassword'
import Login from './containers/Login'
import authService from './services/auth'
import reducers from './states/reducers'
import root from './states/sagas'

import './index.css'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(root)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path='/forgot-password' component={ForgotPassword} />
        <Route exact path='/login' component={Login} />
        <Route path='/' render={renderLandingPage} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
)

function renderLandingPage () {
  return isLoggedIn() ? <App /> : <Redirect to='/login' />
}

function isLoggedIn () {
  return authService.isSignedIn()
}
