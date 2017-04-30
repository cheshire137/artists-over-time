class LastfmApi < Fetcher
  def initialize
    super('https://ws.audioscrobbler.com/2.0/', nil)
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

  def get_path(method:, user:)
    user_param = URI.escape(user, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))
    "?method=#{method}&user=#{user_param}&api_key=#{ENV['LASTFM_API_KEY']}&format=json"
  end
end
