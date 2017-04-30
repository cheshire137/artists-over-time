class LastfmApi < Fetcher
  def initialize
    super('https://ws.audioscrobbler.com/2.0/', nil)
  end

  # http://www.last.fm/api/show/user.getArtistTracks
  def artist_tracks(artist, user:, from: nil, to: nil)
    path = get_path(method: 'user.getartisttracks', user: user) +
      "&artist=#{escape(artist)}"
    path += "&startTimestamp=#{from}" if from
    path += "&endTimestamp=#{to}" if to
    json = get(path)

    return unless json && json['artisttracks']

    json['artisttracks']
  end

  # http://www.last.fm/api/show/user.getWeeklyArtistChart
  def weekly_artists(user, from:, to:)
    path = get_path(method: 'user.getweeklyartistchart', user: user) +
      "&from=#{from}&to=#{to}"
    json = get(path)

    return unless json && json['weeklyartistchart']

    artists = json['weeklyartistchart']['artist']
    total_play_count = 0
    artists = artists.uniq { |artist| artist['mbid'] }

    artists.each do |artist|
      artist['playcount'] = artist['playcount'].to_i
      total_play_count += artist['playcount']
    end

    artists.each do |artist|
      artist['percent'] = 100 * artist['playcount'] / total_play_count.to_f
    end

    artists.sort_by { |artist| -artist['playcount'] }
  end

  private

  def escape(str)
    URI.escape(str, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))
  end

  def get_path(method:, user:)
    "?method=#{method}&user=#{escape(user)}&api_key=#{ENV['LASTFM_API_KEY']}&format=json"
  end
end
