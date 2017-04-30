import PropTypes from 'prop-types'

const AnonLayout = function(props) {
  const path = props.location.pathname
  return (
    <div className="layout-container">
      <div className="container">
        <nav className="nav">
          <div className="nav-right">
            <a
              href="/users/auth/lastfm"
              className="nav-item"
            >Sign in with Last.fm</a>
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
        {props.children}
      </div>
    </div>
  )
}

AnonLayout.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default AnonLayout
