class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  before_action :authenticate_user!, only: [:spotify]

  def spotify
    auth = request.env['omniauth.auth']

    current_user.spotify_refresh_token = auth.credentials.refresh_token
    current_user.spotify_access_token = auth.credentials.token
    current_user.email = auth.extra.raw_info.email
    current_user.spotify_uid = auth.extra.raw_info.id

    unless current_user.save
      flash[:error] = 'Failed to sign in with Spotify: ' +
        current_user.errors.full_messages.join(', ')
    end

    redirect_to root_path
  end

  def lastfm
    auth = request.env['omniauth.auth']

    user = User.where(username: auth.credentials.name).first_or_initialize
    user.lastfm_access_token = auth.credentials.token
    user.lastfm_uid = auth.uid
    user.lastfm_url = auth.extra.raw_info.url

    if image = auth.extra.raw_info.image.detect { |img| img['size'] == 'large' }
      user.avatar_url = image['#text']
    end

    if user.new_record?
      user.password = Devise.friendly_token[0, 20]
    end

    if user.save
      sign_in_and_redirect(user, event: :authentication)
    else
      flash[:error] = "Failed to sign up: #{user.errors.full_messages.join(', ')}"
      redirect_to root_path
    end
  end

  def failure
    redirect_to root_path
  end
end
