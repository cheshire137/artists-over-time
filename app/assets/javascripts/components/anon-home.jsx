import PropTypes from 'prop-types'

import WeeklyArtistsChart from './weekly-artists-chart.jsx'

class AnonHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = { user: '', showChart: false }
  }

  onUserFormSubmit(event) {
    event.preventDefault()
    this.setState({ showChart: true })
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
        <div id="chart-container">
          {showChart ? (
            <WeeklyArtistsChart
              user={user}
              baseUrl=""
              dateStr={this.props.params.dateStr}
            />
          ) : this.userForm()}
        </div>
      </section>
    )
  }
}

AnonHome.propTypes = {
  params: PropTypes.object
}

export default AnonHome
