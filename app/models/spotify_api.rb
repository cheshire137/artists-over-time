require 'base64'
require 'net/http'

class SpotifyApi < Fetcher
  def initialize(token)
    super('https://api.spotify.com/v1', token)
  end

  def self.refresh_tokens(refresh_token)
    grant = Base64.strict_encode64("#{ENV['SPOTIFY_API_KEY']}:#{ENV['SPOTIFY_API_SECRET']}")

    uri = URI.parse('https://accounts.spotify.com/api/token')
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    headers = { 'Authorization' => "Basic #{grant}" }
    req = Net::HTTP::Post.new(uri.request_uri, headers)
    data = { 'grant_type' => 'refresh_token',
             'refresh_token' => refresh_token }
    req.set_form_data(data)

    res = http.request(req)
    if res.kind_of? Net::HTTPSuccess
      json = JSON.parse(res.body)
      json.slice('access_token', 'refresh_token')
    else
      Rails.logger.error "POST #{uri}"
      Rails.logger.error res.body
      nil
    end
  end

  private

  def get_headers
    { 'Authorization' => "Bearer #{token}" }
  end
end
