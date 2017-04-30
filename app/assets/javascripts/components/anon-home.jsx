import PropTypes from 'prop-types'

import WeeklyArtistsChart from './weekly-artists-chart.jsx'

class AnonHome extends React.Component {
  constructor(props) {
    super(props)
    const user = props.params.username || ''
    this.state = {
      user,
      showChart: user && user.length > 0
    }
  }

  onUserFormSubmit(event) {
    event.preventDefault()
    this.setState({ showChart: true }, () => {
      this.props.router.push(`/user/${encodeURIComponent(this.state.user)}`)
    })
  }

  onUserChange(event) {
    this.setState({ user: event.target.value })
  }

  userForm() {
    return (
      <form onSubmit={e => this.onUserFormSubmit(e)}>
        <div className="field">
          <label className="label">Last.fm user name</label>
          <p className="control">
            <input
              autoFocus
              type="text"
              className="input is-large"
              placeholder="Last.fm user name"
              onChange={e => this.onUserChange(e)}
              value={this.state.user}
            />
          </p>
        </div>
        <button type="submit" className="button is-primary is-large">
          View artists
        </button>
      </form>
    )
  }

  render() {
    const { user, showChart } = this.state

    return (
      <section className="section">
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <div id="chart-container">
              {showChart ? (
                <WeeklyArtistsChart
                  user={user}
                  baseUrl={`/user/${encodeURIComponent(user)}`}
                  dateStr={this.props.params.dateStr}
                />
              ) : this.userForm()}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

AnonHome.propTypes = {
  params: PropTypes.object,
  router: PropTypes.object.isRequired
}

export default AnonHome
