import { Router, IndexRoute, Route, browserHistory } from 'react-router'
import PropTypes from 'prop-types'

import AppApi from '../models/app-api'
import LocalStorage from '../models/local-storage'

import AnonHome from './anon-home.jsx'
import AnonLayout from './anon-layout.jsx'
import AuthHome from './auth-home.jsx'
import AuthLayout from './auth-layout.jsx'
import NotFound from './not-found.jsx'

function storeUserData(json) {
  LocalStorage.set('authenticity-token', json.authenticityToken)
  LocalStorage.set('email', json.email)
}

function clearUserData() {
  LocalStorage.delete('authenticity-token')
  LocalStorage.delete('email')
}

function requireAuth(nextState, replace, callback) {
  const api = new AppApi()
  api.getUser().then(json => {
    if (json.auth) {
      storeUserData(json)
    } else {
      clearUserData()
      replace({
        pathname: '/',
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }).then(callback)
}

function redirectIfSignedIn(nextState, replace, callback) {
  const newPath = `/user${nextState.location.pathname}`

  if (LocalStorage.has('email')) {
    const email = LocalStorage.get('email')
    if (email && email.length > 0) {
      replace({
        pathname: newPath,
        state: { nextPathname: nextState.location.pathname }
      })
      callback()
      return
    }
  }

  const api = new AppApi()
  api.getUser().then(json => {
    if (json.auth) {
      storeUserData(json)
      replace({
        pathname: newPath,
        state: { nextPathname: nextState.location.pathname }
      })
    } else {
      clearUserData()
    }
  }).then(callback)
}

const App = function() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={AnonLayout} onEnter={redirectIfSignedIn}>
        <IndexRoute component={AnonHome} />
      </Route>
      <Route path="/user" component={AuthLayout} onEnter={requireAuth}>
        <IndexRoute component={AuthHome} />
      </Route>
      <Route path="*" component={NotFound} />
    </Router>
  )
}

export default App
