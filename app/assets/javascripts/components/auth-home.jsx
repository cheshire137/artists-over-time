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
        <WeeklyArtistsChart user={this.state.username} />
      </section>
    )
  }
}

AuthHome.propTypes = {
}

export default AuthHome
