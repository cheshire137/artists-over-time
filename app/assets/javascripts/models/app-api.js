import Fetcher from './fetcher'

export default class AppApi extends Fetcher {
  constructor() {
    super('/api')

    const tokenMeta = document.querySelector('meta[name="csrf-token"]')
    this.token = tokenMeta.content

    this.defaultHeaders = {
      'X-CSRF-TOKEN': this.token,
      'Content-type': 'application/json'
    }
  }

  getUser() {
    return this.get('/user', this.defaultHeaders).then(json => json.user)
  }

  getLastfmWeeklyArtists(user, from, to) {
    const userParam = encodeURIComponent(user)
    const fromParam = Math.round(from.getTime() / 1000)
    const toParam = Math.round(to.getTime() / 1000)
    const params = `?user=${userParam}&from=${fromParam}&to=${toParam}`
    return this.get(`/lastfm/weekly-artists${params}`, this.defaultHeaders)
  }

  getLastfmArtistTracks(user, artist, from, to) {
    const userParam = encodeURIComponent(user)
    const artistParam = encodeURIComponent(artist)
    const fromParam = Math.round(from.getTime() / 1000)
    const toParam = Math.round(to.getTime() / 1000)
    const params = `?user=${userParam}&artist=${artistParam}&from=${fromParam}&to=${toParam}`
    return this.get(`/lastfm/artist-tracks${params}`, this.defaultHeaders)
  }

  getLastfmFriends(user) {
    const userParam = encodeURIComponent(user)
    const params = `?user=${userParam}`
    return this.get(`/lastfm/friends${params}`, this.defaultHeaders)
  }
}
