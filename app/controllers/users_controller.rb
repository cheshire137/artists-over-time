class UsersController < ApplicationController
  before_action :authenticate_user!, only: [:disconnect_spotify]

  def current
    if user_signed_in?
      @user = current_user
      render template: 'users/show'
    else
      render json: {
        user: {
          auth: false,
          username: nil,
          authenticityToken: form_authenticity_token,
          spotifyUser: nil
        }
      }
    end
  end

  def disconnect_spotify
    current_user.spotify_uid = nil
    current_user.email = nil
    current_user.spotify_access_token = nil
    current_user.spotify_refresh_token = nil

    if current_user.save
      flash[:notice] = 'Successfully disconnected from your Spotify account.'
    else
      flash[:error] = 'Failed to disconnect from Spotify: ' +
        current_user.errors.full_messages.join(', ')
    end

    redirect_to root_path
  end
end
