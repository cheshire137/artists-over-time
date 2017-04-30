import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

import AppApi from '../models/app-api'

import ChartControls from './chart-controls.jsx'

class WeeklyArtistsChart extends React.Component {
  constructor(props) {
    super(props)
    const toDate = new Date()
    this.state = {
      allArtists: null,
      artists: null,
      toDate,
      fromDate: this.getStartOfWeek(toDate),
      percentCutoff: 2
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
    this.setState({
      allArtists: artists,
      artists: this.filterArtists(artists)
    })
  }

  onPercentCutoffChange(percentCutoff) {
    this.setState({ percentCutoff }, () => {
      this.setState({ artists: this.filterArtists(this.state.allArtists) })
    })
  }

  filterArtists(artists) {
    const cutoff = this.state.percentCutoff
    return artists.filter(artist => artist.percent >= cutoff)
  }

  render() {
    const { artists, fromDate, toDate, percentCutoff, allArtists } = this.state

    if (!artists) {
      return <p>Loading...</p>
    }

    return (
      <div className="content">
        <h3 className="artists-chart-title subtitle is-4">
          Artists for <strong> {this.props.user}</strong>
        </h3>
        <h4 className="subtitle is-6">
          {fromDate.toLocaleDateString()} - {toDate.toLocaleDateString()}
          <span> &middot; {artists.length} artist{artists.length === 1 ? '' : 's'} of</span>
          <span> {allArtists.length}</span>
        </h4>
        <ChartControls
          percentCutoff={percentCutoff}
          onPercentCutoffChange={value => this.onPercentCutoffChange(value)}
        />
        <ul className="artists-list">
          {artists.map(artist => {
            const barStyle = { width: `${artist.percent}%` }
            return (
              <li key={artist.mbid}>
                <div className="columns">
                  <div className="artist-column column has-text-right">
                    <a
                      className="artist-link"
                      href={artist.url}
                      target="_blank"
                      title={artist.name}
                      rel="noopener noreferrer"
                    >{artist.name}</a>
                  </div>
                  <div className="artist-column column has-text-left">
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
