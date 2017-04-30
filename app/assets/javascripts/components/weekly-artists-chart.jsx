import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

import AppApi from '../models/app-api'

class WeeklyArtistsChart extends React.Component {
  constructor(props) {
    super(props)
    const toDate = new Date()
    this.state = {
      artists: null,
      toDate,
      fromDate: this.getStartOfWeek(toDate)
    }
  }

  // Where Sunday is considered the start
  getStartOfWeek(endOfWeek) {
    endOfWeek = new Date(endOfWeek)
    const day = endOfWeek.getDay()
    const diff = endOfWeek.getDate() - day + (day === 0 ? -6 : 0)
    return new Date(endOfWeek.setDate(diff))
  }

  componentDidMount() {
    const { fromDate, toDate } = this.state

    const api = new AppApi()
    api.getLastfmWeeklyArtists(this.props.user, fromDate, toDate).
        then(artists => this.onArtistsLoaded(artists)).
        catch(err => console.error('failed to load artists', err))
  }

  onArtistsLoaded(artists) {
    this.setState({ artists })
  }

  render() {
    const { artists, fromDate, toDate } = this.state

    if (!artists) {
      return <p>Loading...</p>
    }

    return (
      <div className="content">
        <h3 className="subtitle is-4">
          Artists from {fromDate.toLocaleDateString()} - {toDate.toLocaleDateString()}
          <small> &middot; {artists.length} play{artists.length === 1 ? '' : 's'}</small>
        </h3>
        <ul className="artists-list">
          {artists.map(artist => {
            const barStyle = { width: `${artist.percent}%` }
            return (
              <li key={artist.mbid}>
                <div className="columns">
                  <div className="artist-column column is-3">
                    <a
                      className="artist-link"
                      href={artist.url}
                      target="_blank"
                      title={artist.name}
                      rel="noopener noreferrer"
                    >{artist.name}</a>
                  </div>
                  <div className="artist-column column">
                    <div className="artist-bar-container" style={barStyle}>
                      <span className="artist-bar"></span>
                    </div>
                    <span className="artist-play-count">
                      {artist.playcount}
                    </span>
                    <span className="artist-percent">
                      {Math.round(artist.percent)}% of plays
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

WeeklyArtistsChart.propTypes = {
  user: PropTypes.string.isRequired
}

export default WeeklyArtistsChart
