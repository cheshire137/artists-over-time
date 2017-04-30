import PropTypes from 'prop-types'

import LocalStorage from '../models/local-storage'

class AuthLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: LocalStorage.get('username'),
      avatarUrl: LocalStorage.get('avatarUrl'),
      authenticityToken: LocalStorage.get('authenticity-token')
    }
  }

  render() {
    const { username, avatarUrl, authenticityToken } = this.state
    const path = this.props.location.pathname
    return (
      <div className="layout-container">
        <div className="container">
          <nav className="nav">
            <div className="nav-right">
              <span
                className="nav-item"
              >
                <img src={avatarUrl} className="user-avatar" width="24" />
                {username}
              </span>
              <form
                action="/users/sign_out"
                method="post"
                className="nav-item"
              >
                <input name="_method" type="hidden" value="delete" />
                <input name="authenticity_token" type="hidden" value={authenticityToken} />
                <button
                  className="button is-link"
                  type="submit"
                >Sign out</button>
              </form>
            </div>
          </nav>
        </div>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                <a href="/">Weekly Artists</a>
              </h1>
              <h2 className="subtitle">
                View which artists you listened to each week via your
                Last.fm history.
              </h2>
            </div>
          </div>
        </section>
        <div className="layout-children-container">
          {this.props.children}
        </div>
      </div>
    )
  }
}

AuthLayout.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default AuthLayout
