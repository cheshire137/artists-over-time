import PropTypes from 'prop-types'

import AppApi from '../models/app-api'

class LastfmFriends extends React.Component {
  constructor(props) {
    super(props)
    this.state = { friends: null }
  }

  componentDidMount() {
    const api = new AppApi()
    api.getLastfmFriends(this.props.user).
        then(friends => this.onFriendsLoaded(friends)).
        catch(err => console.error('failed to load friends', err))
  }

  onFriendsLoaded(friends) {
    console.log(friends)
    this.setState({ friends })
  }

  render() {
    const { friends } = this.state

    if (!friends) {
      return <p>Loading...</p>
    }

    return (
      <ul className="lastfm-friends-list">
        {friends.map(friend => (
          <li key={friend.registered.unixtime}>
            <a
              href={`/lastfm/user/${encodeURIComponent(friend.name)}`}
            >{friend.name}</a>
          </li>
        ))}
      </ul>
    )
  }
}

LastfmFriends.propTypes = {
  user: PropTypes.string.isRequired
}

export default LastfmFriends
