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
      <WeeklyArtistsChart
        user={this.state.username}
        baseUrl="/lastfm"
        dateStr={this.props.params.dateStr}
      />
    )
  }
}

AuthHome.propTypes = {
  params: PropTypes.object
}

export default AuthHome
