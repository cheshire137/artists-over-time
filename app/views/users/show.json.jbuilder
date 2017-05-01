json.user do
  json.auth true
  json.username @user.username
  json.lastfmUrl @user.lastfm_url
  json.avatarUrl @user.avatar_url
  json.authenticityToken form_authenticity_token
  json.spotifyUser @user.spotify_uid
end
