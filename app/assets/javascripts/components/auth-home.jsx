import PropTypes from 'prop-types'

import LocalStorage from '../models/local-storage'

import WeeklyArtistsChart from './weekly-artists-chart.jsx'

class AuthHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = { username: LocalStorage.get('username') }
  }

  render() {
    return (
      <section className="section">
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <WeeklyArtistsChart
              user={this.state.username}
              baseUrl="/lastfm"
              dateStr={this.props.params.dateStr}
            />
          </div>
        </div>
      </section>
    )
  }
}

AuthHome.propTypes = {
  params: PropTypes.object
}

export default AuthHome
