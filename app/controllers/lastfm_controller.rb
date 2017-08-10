class LastfmController < ApplicationController
  before_action :require_user

  def friends
    api = LastfmApi.new
    user = params[:user] || current_user.username
    friends = api.friends(user)

    return head api.response_code unless friends

    render json: friends
  end

  def artist_tracks
    return head :bad_request unless params[:artist].present?

    api = LastfmApi.new
    user = params[:user] || current_user.username
    tracks = api.artist_tracks(params[:artist], user: user,
                               from: params[:from], to: params[:to])

    return head api.response_code unless tracks

    render json: tracks
  end

  def weekly_artists
    return head :bad_request unless params[:from].present?
    return head :bad_request unless params[:to].present?

    api = LastfmApi.new
    user = params[:user] || current_user.username
    artists = api.weekly_artists(user, from: params[:from],
                                 to: params[:to])

    return head api.response_code unless artists

    render json: artists
  end

  private

  def require_user
    unless user_signed_in?
      head :bad_request unless params[:user].present?
    end
  end
end
