import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

import AppApi from '../models/app-api'

import ChartControls from './chart-controls.jsx'

class WeeklyArtistsChart extends React.Component {
  static parseDate(dateStr) {
    if (dateStr && dateStr.length > 0) {
      const parts = dateStr.split('-')
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10)
      const day = parseInt(parts[2], 10)

      return new Date(year, month - 1, day)
    }

    return new Date()
  }

  // Where Sunday is considered the start
  static getOneWeekAgo(endOfWeek) {
    endOfWeek = new Date(endOfWeek)
    const diff = endOfWeek.getDate() - 7
    return new Date(endOfWeek.setDate(diff))
  }

  constructor(props) {
    super(props)

    const toDate = WeeklyArtistsChart.parseDate(props.dateStr)

    this.state = {
      allArtists: null,
      artists: null,
      toDate,
      fromDate: WeeklyArtistsChart.getOneWeekAgo(toDate),
      percentCutoff: 2,
      showControls: false
    }
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

  toggleControls(event) {
    event.target.blur()
    this.setState({ showControls: !this.state.showControls })
  }

  previousDateLink() {
    const { fromDate } = this.state
    const { baseUrl } = this.props
    const year = fromDate.getFullYear()
    let month = fromDate.getMonth() + 1
    if (month < 10) {
      month = `0${month}`
    }
    let day = fromDate.getDate()
    if (day < 10) {
      day = `0${day}`
    }
    const dateStr = `${year}-${month}-${day}`
    return (
      <a
        className="change-week-link"
        href={`${baseUrl}/${dateStr}`}
      ><i className="fa fa-angle-left" aria-hidden="true" /></a>
    )
  }

  render() {
    const { artists, fromDate, toDate, percentCutoff,
            allArtists, showControls } = this.state

    if (!artists) {
      return <p>Loading...</p>
    }

    return (
      <div className="content">
        <h4 className="subtitle is-6 pull-right">
          {this.previousDateLink()}
          {fromDate.toLocaleDateString()} - {toDate.toLocaleDateString()}
        </h4>
        <h3 className="artists-chart-title subtitle is-4">
          Artists for <strong> {this.props.user}</strong>
        </h3>
        <h4 className="subtitle is-6">
          <button
            type="button"
            className="button is-link"
            onClick={e => this.toggleControls(e)}
          >
            <i className={`fa ${showControls ? 'fa-chevron-down' : 'fa-chevron-right'}`} aria-hidden="true" />
            <span>{artists.length} / {allArtists.length} artist{allArtists.length === 1 ? '' : 's'}</span>
          </button>
        </h4>
        {showControls ? (
          <ChartControls
            percentCutoff={percentCutoff}
            onPercentCutoffChange={value => this.onPercentCutoffChange(value)}
          />
        ) : ''}
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
  user: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired,
  dateStr: PropTypes.string
}

export default WeeklyArtistsChart
