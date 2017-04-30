import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

import AppApi from '../models/app-api'

import ArtistTracks from './artist-tracks.jsx'
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

  static addDaysToDate(date, numDays) {
    date = new Date(date)
    const diff = date.getDate() + numDays
    return new Date(date.setDate(diff))
  }

  static dateToURLParam(date) {
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    if (month < 10) {
      month = `0${month}`
    }
    let day = date.getDate()
    if (day < 10) {
      day = `0${day}`
    }
    return `${year}-${month}-${day}`
  }

  constructor(props) {
    super(props)

    const toDate = WeeklyArtistsChart.parseDate(props.dateStr)

    this.state = {
      allArtists: null,
      artists: null,
      toDate,
      fromDate: WeeklyArtistsChart.addDaysToDate(toDate, -7),
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
    const dateStr = WeeklyArtistsChart.dateToURLParam(fromDate)
    return (
      <a
        className="change-week-link"
        href={`${baseUrl}/${dateStr}`}
      ><i className="fa fa-angle-left" aria-hidden="true" /></a>
    )
  }

  nextDateLink() {
    const { toDate } = this.state
    const today = new Date()
    const toDateStr = WeeklyArtistsChart.dateToURLParam(toDate)
    const todayStr = WeeklyArtistsChart.dateToURLParam(today)
    if (toDateStr === todayStr) {
      return null
    }

    const { baseUrl } = this.props
    const newToDate = WeeklyArtistsChart.addDaysToDate(toDate, 7)
    const dateStr = WeeklyArtistsChart.dateToURLParam(newToDate)
    return (
      <a
        className="change-week-link"
        href={`${baseUrl}/${dateStr}`}
      ><i className="fa fa-angle-right" aria-hidden="true" /></a>
    )
  }

  areArtistTracksShown(artist) {
    return this.state[`showArtist${artist.mbid}`]
  }

  toggleArtistTracks(event, artist) {
    event.preventDefault()
    event.target.blur()
    this.setState({ [`showArtist${artist.mbid}`]: !this.areArtistTracksShown(artist) })
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
          {this.nextDateLink()}
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
            const isExpanded = this.areArtistTracksShown(artist)
            return (
              <li className="artist-list-item" key={artist.mbid}>
                <div className="columns artist-chart-columns">
                  <div className="artist-column is-6 column">
                    <button
                      type="button"
                      title={artist.name}
                      className="button is-link artist-name-button"
                      onClick={e => this.toggleArtistTracks(e, artist)}
                    >
                      <i className={`fa fa-chevron-${isExpanded ? 'down' : 'right'}`} aria-hidden="true" />
                      {artist.name}
                    </button>
                    <a
                      href={artist.url}
                      target="_blank"
                      className="artist-external-link"
                      title="View artist on Last.fm"
                      rel="noopener noreferrer"
                    ><i className="fa fa-link" aria-hidden="true" /></a>
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
                {isExpanded ? (
                  <ArtistTracks
                    artistName={artist.name}
                    user={this.props.user}
                    fromDate={fromDate}
                    toDate={toDate}
                  />
                ) : ''}
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
