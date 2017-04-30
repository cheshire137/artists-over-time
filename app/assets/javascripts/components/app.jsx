import { Router, IndexRoute, Route, browserHistory } from 'react-router'

import AppApi from '../models/app-api'
import LocalStorage from '../models/local-storage'

import AnonHome from './anon-home.jsx'
import AnonLayout from './anon-layout.jsx'
import AuthHome from './auth-home.jsx'
import AuthLayout from './auth-layout.jsx'
import NotFound from './not-found.jsx'

function storeUserData(json) {
  LocalStorage.set('authenticity-token', json.authenticityToken)
  LocalStorage.set('username', json.username)
  LocalStorage.set('avatarUrl', json.avatarUrl)
}

function clearUserData() {
  LocalStorage.delete('authenticity-token')
  LocalStorage.delete('username')
  LocalStorage.delete('avatarUrl')
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
  const newPath = `/lastfm${nextState.location.pathname}`

  if (LocalStorage.has('username')) {
    const username = LocalStorage.get('username')
    if (username && username.length > 0) {
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
        <Route path="/user/:username" component={AnonHome} />
        <Route path="/user/:username/:dateStr" component={AnonHome} />
      </Route>
      <Route path="/lastfm" component={AuthLayout} onEnter={requireAuth}>
        <IndexRoute component={AuthHome} />
        <Route path=":dateStr" component={AuthHome} />
      </Route>
      <Route path="*" component={NotFound} />
    </Router>
  )
}

export default App
