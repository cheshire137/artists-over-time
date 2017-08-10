import PropTypes from 'prop-types'

import AppApi from '../models/app-api'
import LocalStorage from '../models/local-storage'

import LastfmFriends from './lastfm-friends.jsx'

class AuthLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: LocalStorage.get('username'),
      avatarUrl: LocalStorage.get('avatarUrl'),
      authenticityToken: LocalStorage.get('authenticity-token'),
      spotifyUser: LocalStorage.get('spotifyUser')
    }
  }

  confirmSpotifyDisconnect(event) {
    event.target.blur()

    if (!confirm('Are you sure you want to disconnect your Spotify account?')) {
      event.preventDefault()
    }
  }

  render() {
    const { username, avatarUrl, authenticityToken,
            spotifyUser } = this.state

    return (
      <div className="layout-container">
        <div className="container">
          <nav className="nav">
            <div className="nav-right">
              <span
                className="nav-item"
              >
                <img
                  src={avatarUrl}
                  className="user-avatar"
                  width="24"
                  alt=""
                />
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
          <section className="section">
            <div className="columns">
              <div className="column is-8">
                {this.props.children}
              </div>
              <div className="column is-4">
                <LastfmFriends user={username} />
                {spotifyUser && spotifyUser.length > 0 ? (
                  <div>
                    <p>
                      Signed in as <strong>{spotifyUser}</strong> on Spotify.
                    </p>
                    <form
                      action="/users/disconnect-spotify"
                      method="post"
                    >
                      <input name="_method" type="hidden" value="delete" />
                      <input name="authenticity_token" type="hidden" value={authenticityToken} />
                      <button
                        type="submit"
                        className="button is-small is-flush is-link"
                        onClick={e => this.confirmSpotifyDisconnect(e)}
                      >Disconnect</button>
                    </form>
                  </div>
                ) : (
                  <a
                    className="button is-spotify"
                    href="/users/auth/spotify"
                  >Sign in with Spotify</a>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

AuthLayout.propTypes = {
  children: PropTypes.object.isRequired
}

export default AuthLayout
