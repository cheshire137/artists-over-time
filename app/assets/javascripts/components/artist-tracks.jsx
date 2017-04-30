import PropTypes from 'prop-types'

import AppApi from '../models/app-api'

class ArtistTracks extends React.Component {
  constructor(props) {
    super(props)

    this.state = { tracks: null }
  }

  componentDidMount() {
    const { fromDate, toDate, user, artistName } = this.props

    const api = new AppApi()
    api.getLastfmArtistTracks(user, artistName, fromDate, toDate).
        then(tracks => this.onTracksLoaded(tracks)).
        catch(err => console.error('failed to load tracks', err))
  }

  onTracksLoaded(tracks) {
    this.setState({ tracks })
  }

  render() {
    const { tracks } = this.state

    if (!tracks) {
      return <p>Loading...</p>
    }

    return (
      <div className="columns">
        <div className="track-column column is-10 is-offset-1">
          <ul className="tracks-list has-text-left">
            {tracks.map(track => {
              const imageUrl = track.image[0]['#text']

              return (
                <li key={track.date.uts}>
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {imageUrl && imageUrl.length > 0 ? (
                      <img
                        src={imageUrl}
                        className="track-image"
                        width="24"
                        alt=""
                      />
                    ) : ''}
                    {track.name}
                  </a>
                  <small> &middot; {track.playcount} play{track.playcount === 1 ? '' : 's'}</small>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

ArtistTracks.propTypes = {
  user: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  fromDate: PropTypes.instanceOf(Date).isRequired,
  toDate: PropTypes.instanceOf(Date).isRequired
}

export default ArtistTracks
