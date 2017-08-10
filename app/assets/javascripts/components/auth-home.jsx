import PropTypes from 'prop-types'

import LocalStorage from '../models/local-storage'

import WeeklyArtistsChart from './weekly-artists-chart.jsx'

class AuthHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = { username: LocalStorage.get('username') }
  }

  render() {
    const { params } = this.props
    const username = params.username || this.state.username

    return (
      <WeeklyArtistsChart
        user={username}
        baseUrl={`/lastfm/user/${encodeURIComponent(username)}`}
        dateStr={params.dateStr}
      />
    )
  }
}

AuthHome.propTypes = {
  params: PropTypes.object
}

export default AuthHome
