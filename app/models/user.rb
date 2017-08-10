class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :recoverable, :confirmable, :lockable, :registerable,
  # :timeoutable, :trackable
  devise :database_authenticatable, :validatable, :rememberable,
    authentication_keys: [:username]

  devise :omniauthable, omniauth_providers: [:lastfm, :spotify]

  alias_attribute :to_s, :username

  validates :username, presence: true, uniqueness: true

  scope :with_username, ->(username) { where(username: username) }

  def email_required?
    false
  end

  # Updates the Spotify access and refresh tokens for the given User.
  # Returns true on success, false or nil on error.
  def update_spotify_tokens
    tokens = SpotifyApi.refresh_tokens(spotify_refresh_token)

    if tokens
      self.spotify_access_token = tokens['access_token']
      self.spotify_refresh_token = tokens['refresh_token']
      save
    end
  end
end
